const pool = require("../db");

const getMovements = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT m.*, p.name as product_name, p.sku, u.name as user_name FROM movements m JOIN products p ON m.product_id = p.id JOIN users u ON m.user_id = u.id ORDER BY m.created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createMovement = async (req, res) => {
  try {
    const { product_id, warehouse_id, movement_type, quantity, notes } =
      req.body;
    const userId = req.user.userId;

    if (!product_id || !warehouse_id || !movement_type || quantity === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      "INSERT INTO movements (product_id, warehouse_id, movement_type, quantity, user_id, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [product_id, warehouse_id, movement_type, quantity, userId, notes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMovementHistory = async (req, res) => {
  try {
    const { productId, warehouseId } = req.query;
    let query =
      "SELECT m.*, p.name as product_name, w.name as warehouse_name, u.name as user_name FROM movements m JOIN products p ON m.product_id = p.id JOIN warehouses w ON m.warehouse_id = w.id JOIN users u ON m.user_id = u.id WHERE 1=1";
    const params = [];

    if (productId) {
      query += " AND m.product_id = $" + (params.length + 1);
      params.push(productId);
    }

    if (warehouseId) {
      query += " AND m.warehouse_id = $" + (params.length + 1);
      params.push(warehouseId);
    }

    query += " ORDER BY m.created_at DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMovements,
  createMovement,
  getMovementHistory,
};
