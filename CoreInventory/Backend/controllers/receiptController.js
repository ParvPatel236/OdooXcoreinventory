const pool = require("../db");

const getReceipts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT r.*, s.name as supplier_name, u.name as user_name FROM receipts r LEFT JOIN suppliers s ON r.supplier_id = s.id JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createReceipt = async (req, res) => {
  try {
    const { supplier_id, warehouse_id, items, notes } = req.body;
    const userId = req.user.userId;

    if (!warehouse_id || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      "INSERT INTO receipts (supplier_id, warehouse_id, user_id, notes, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [supplier_id || null, warehouse_id, userId, notes || null, "completed"]
    );

    const receipt = result.rows[0];

    for (const item of items) {
      await pool.query(
        "INSERT INTO receipt_items (receipt_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
        [receipt.id, item.product_id, item.quantity, item.unit_price || 0]
      );

      await pool.query(
        "UPDATE stock_levels SET quantity = quantity + $1 WHERE product_id = $2 AND warehouse_id = $3",
        [item.quantity, item.product_id, warehouse_id]
      );
    }

    res.status(201).json(receipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReceiptDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await pool.query("SELECT * FROM receipts WHERE id = $1", [
      id,
    ]);

    if (receipt.rows.length === 0) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    const items = await pool.query(
      "SELECT ri.*, p.name, p.sku FROM receipt_items ri JOIN products p ON ri.product_id = p.id WHERE ri.receipt_id = $1",
      [id]
    );

    res.json({ ...receipt.rows[0], items: items.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getReceipts,
  createReceipt,
  getReceiptDetails,
};
