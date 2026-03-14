const pool = require("../db");

const getSuppliers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM suppliers ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { name, contact_person, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Supplier name required" });
    }

    const result = await pool.query(
      "INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, contact_person || null, email || null, phone || null, address || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, email, phone, address } = req.body;

    const result = await pool.query(
      "UPDATE suppliers SET name = COALESCE($1, name), contact_person = COALESCE($2, contact_person), email = COALESCE($3, email), phone = COALESCE($4, phone), address = COALESCE($5, address) WHERE id = $6 RETURNING *",
      [name, contact_person, email, phone, address, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM suppliers WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
