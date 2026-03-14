const pool = require("../db");

const getAdjustments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT a.*, p.name as product_name, p.sku, w.name as warehouse_name, u.name as user_name FROM adjustments a JOIN products p ON a.product_id = p.id JOIN warehouses w ON a.warehouse_id = w.id JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAdjustment = async (req, res) => {
  try {
    const { product_id, warehouse_id, adjustment_type, quantity, reason } =
      req.body;
    const userId = req.user.userId;

    if (
      !product_id ||
      !warehouse_id ||
      !adjustment_type ||
      quantity === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      "INSERT INTO adjustments (product_id, warehouse_id, adjustment_type, quantity, reason, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [product_id, warehouse_id, adjustment_type, quantity, reason || null, userId]
    );

    const adjustment = result.rows[0];

    const quantityChange =
      adjustment_type === "increase" ? quantity : -quantity;
    await pool.query(
      "UPDATE stock_levels SET quantity = quantity + $1 WHERE product_id = $2 AND warehouse_id = $3",
      [quantityChange, product_id, warehouse_id]
    );

    res.status(201).json(adjustment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAdjustments,
  createAdjustment,
};
