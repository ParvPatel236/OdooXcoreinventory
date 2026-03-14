const pool = require("../db");

const getStockLevels = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT sl.*, p.name, p.sku, w.name as warehouse_name FROM stock_levels sl JOIN products p ON sl.product_id = p.id JOIN warehouses w ON sl.warehouse_id = w.id ORDER BY p.name"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStockByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query(
      "SELECT sl.*, w.name as warehouse_name FROM stock_levels sl JOIN warehouses w ON sl.warehouse_id = w.id WHERE sl.product_id = $1",
      [productId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStockLevel = async (req, res) => {
  try {
    const { productId, warehouseId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: "Quantity required" });
    }

    const result = await pool.query(
      "UPDATE stock_levels SET quantity = $1, last_updated = NOW() WHERE product_id = $2 AND warehouse_id = $3 RETURNING *",
      [quantity, productId, warehouseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Stock level not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT p.*, sl.quantity, sl.warehouse_id, w.name as warehouse_name FROM products p JOIN stock_levels sl ON p.id = sl.product_id JOIN warehouses w ON sl.warehouse_id = w.id WHERE sl.quantity <= p.reorder_level ORDER BY p.name"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getStockLevels,
  getStockByProduct,
  updateStockLevel,
  getLowStockProducts,
};
