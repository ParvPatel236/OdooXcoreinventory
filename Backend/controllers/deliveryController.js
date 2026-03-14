const pool = require("../db");

const getDeliveries = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT d.*, c.name as customer_name, u.name as user_name FROM deliveries d LEFT JOIN customers c ON d.customer_id = c.id JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createDelivery = async (req, res) => {
  try {
    const { customer_id, warehouse_id, items, notes } = req.body;
    const userId = req.user.userId;

    if (!warehouse_id || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      "INSERT INTO deliveries (customer_id, warehouse_id, user_id, notes, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [customer_id || null, warehouse_id, userId, notes || null, "completed"]
    );

    const delivery = result.rows[0];

    for (const item of items) {
      await pool.query(
        "INSERT INTO delivery_items (delivery_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
        [delivery.id, item.product_id, item.quantity, item.unit_price || 0]
      );

      await pool.query(
        "UPDATE stock_levels SET quantity = quantity - $1 WHERE product_id = $2 AND warehouse_id = $3",
        [item.quantity, item.product_id, warehouse_id]
      );
    }

    res.status(201).json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDeliveryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await pool.query("SELECT * FROM deliveries WHERE id = $1", [
      id,
    ]);

    if (delivery.rows.length === 0) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    const items = await pool.query(
      "SELECT di.*, p.name, p.sku FROM delivery_items di JOIN products p ON di.product_id = p.id WHERE di.delivery_id = $1",
      [id]
    );

    res.json({ ...delivery.rows[0], items: items.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDeliveries,
  createDelivery,
  getDeliveryDetails,
};
