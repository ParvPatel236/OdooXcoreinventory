const pool = require("../db");

const getBarcodes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT b.*, p.name, p.sku FROM barcodes b JOIN products p ON b.product_id = p.id ORDER BY b.created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBarcode = async (req, res) => {
  try {
    const { product_id, barcode_value } = req.body;

    if (!product_id || !barcode_value) {
      return res.status(400).json({ error: "Product ID and barcode value required" });
    }

    const result = await pool.query(
      "INSERT INTO barcodes (product_id, barcode_value) VALUES ($1, $2) RETURNING *",
      [product_id, barcode_value]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Barcode already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

const getBarcodeByValue = async (req, res) => {
  try {
    const { barcode_value } = req.params;
    const result = await pool.query(
      "SELECT b.*, p.name, p.sku, p.unit_price FROM barcodes b JOIN products p ON b.product_id = p.id WHERE b.barcode_value = $1",
      [barcode_value]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Barcode not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBarcode = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM barcodes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Barcode not found" });
    }

    res.json({ message: "Barcode deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBarcodes,
  createBarcode,
  getBarcodeByValue,
  deleteBarcode,
};
