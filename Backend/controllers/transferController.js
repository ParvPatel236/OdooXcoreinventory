const pool = require("../db");

const getTransfers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT t.*, p.name as product_name, p.sku, wf.name as from_warehouse, wt.name as to_warehouse, u.name as user_name FROM transfers t JOIN products p ON t.product_id = p.id JOIN warehouses wf ON t.from_warehouse_id = wf.id JOIN warehouses wt ON t.to_warehouse_id = wt.id JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTransfer = async (req, res) => {
  try {
    const { product_id, from_warehouse_id, to_warehouse_id, quantity, notes } =
      req.body;
    const userId = req.user.userId;

    if (
      !product_id ||
      !from_warehouse_id ||
      !to_warehouse_id ||
      quantity === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      "INSERT INTO transfers (product_id, from_warehouse_id, to_warehouse_id, quantity, user_id, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        product_id,
        from_warehouse_id,
        to_warehouse_id,
        quantity,
        userId,
        notes || null,
      ]
    );

    const transfer = result.rows[0];

    await pool.query(
      "UPDATE stock_levels SET quantity = quantity - $1 WHERE product_id = $2 AND warehouse_id = $3",
      [quantity, product_id, from_warehouse_id]
    );

    await pool.query(
      "UPDATE stock_levels SET quantity = quantity + $1 WHERE product_id = $2 AND warehouse_id = $3",
      [quantity, product_id, to_warehouse_id]
    );

    res.status(201).json(transfer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTransfers,
  createTransfer,
};
