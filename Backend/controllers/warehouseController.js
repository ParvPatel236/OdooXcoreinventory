const pool = require("../db");

const getWarehouses = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM warehouses ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createWarehouse = async (req, res) => {
  try {
    const { name, location, capacity } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: "Name and location required" });
    }

    const result = await pool.query(
      "INSERT INTO warehouses (name, location, capacity) VALUES ($1, $2, $3) RETURNING *",
      [name, location, capacity || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, capacity } = req.body;

    const result = await pool.query(
      "UPDATE warehouses SET name = COALESCE($1, name), location = COALESCE($2, location), capacity = COALESCE($3, capacity) WHERE id = $4 RETURNING *",
      [name, location, capacity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM warehouses WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    res.json({ message: "Warehouse deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
