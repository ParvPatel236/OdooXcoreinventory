const pool = require("../db");

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await pool.query(
      "SELECT COUNT(*) as count FROM products"
    );
    const totalWarehouses = await pool.query(
      "SELECT COUNT(*) as count FROM warehouses"
    );
    const lowStockProducts = await pool.query(
      "SELECT COUNT(*) as count FROM stock_levels WHERE quantity <= (SELECT reorder_level FROM products WHERE id = stock_levels.product_id)"
    );
    const totalMovements = await pool.query(
      "SELECT COUNT(*) as count FROM movements"
    );

    res.json({
      totalProducts: totalProducts.rows[0].count,
      totalWarehouses: totalWarehouses.rows[0].count,
      lowStockProducts: lowStockProducts.rows[0].count,
      totalMovements: totalMovements.rows[0].count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStockSummary = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT p.id, p.name, p.sku, SUM(sl.quantity) as total_quantity, p.reorder_level FROM products p LEFT JOIN stock_levels sl ON p.id = sl.product_id GROUP BY p.id, p.name, p.sku, p.reorder_level ORDER BY p.name"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMovementStats = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT movement_type, COUNT(*) as count FROM movements WHERE created_at >= NOW() - INTERVAL '30 days' GROUP BY movement_type"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWarehouseUtilization = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT w.id, w.name, w.capacity, SUM(sl.quantity) as used_capacity FROM warehouses w LEFT JOIN stock_levels sl ON w.id = sl.warehouse_id GROUP BY w.id, w.name, w.capacity"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDashboardStats,
  getStockSummary,
  getMovementStats,
  getWarehouseUtilization,
};
