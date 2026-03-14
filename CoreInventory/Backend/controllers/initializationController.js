// Optional: Auto-Population Controller
// Use this if you want to auto-create default data on first signup

const pool = require("../db");

const initializeDefaultData = async (userId) => {
  try {
    // 1. Create default categories
    const categories = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2), ($3, $4), ($5, $6), ($7, $8), ($9, $10) RETURNING id",
      [
        "Electronics", "Electronic devices and accessories",
        "Furniture", "Office and home furniture",
        "Supplies", "Office supplies and stationery",
        "Hardware", "Computer hardware components",
        "Software", "Software licenses and applications"
      ]
    );

    // 2. Create default warehouses
    const warehouses = await pool.query(
      "INSERT INTO warehouses (name, location, capacity) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9), ($10, $11, $12) RETURNING id",
      [
        "Main Warehouse", "New York", 50000,
        "Secondary Warehouse", "Los Angeles", 30000,
        "Regional Hub", "Chicago", 20000,
        "Distribution Center", "Dallas", 40000
      ]
    );

    // 3. Create default suppliers
    const suppliers = await pool.query(
      "INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10) RETURNING id",
      [
        "Tech Supplies Inc", "John Smith", "john@techsupplies.com", "+1-555-0101", "123 Tech Street, Silicon Valley, CA",
        "Office Furniture Co", "Sarah Johnson", "sarah@officefurniture.com", "+1-555-0102", "456 Furniture Ave, Los Angeles, CA"
      ]
    );

    // 4. Create default customers
    const customers = await pool.query(
      "INSERT INTO customers (name, contact_person, email, phone, address) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10) RETURNING id",
      [
        "ABC Corporation", "Jane Doe", "jane@abccorp.com", "+1-555-0201", "111 Business Ave, New York, NY",
        "XYZ Industries", "Robert Brown", "robert@xyzind.com", "+1-555-0202", "222 Industrial Blvd, Los Angeles, CA"
      ]
    );

    // 5. Create default products
    const products = await pool.query(
      "INSERT INTO products (name, sku, category_id, unit_price, reorder_level) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10), ($11, $12, $13, $14, $15) RETURNING id",
      [
        "Laptop Pro", "LAP001", categories.rows[0].id, 1299.99, 5,
        "Monitor 27\"", "MON001", categories.rows[0].id, 349.99, 10,
        "Office Chair", "CHR001", categories.rows[1].id, 299.99, 5
      ]
    );

    // 6. Create default stock levels
    for (const product of products.rows) {
      for (const warehouse of warehouses.rows) {
        await pool.query(
          "INSERT INTO stock_levels (product_id, warehouse_id, quantity) VALUES ($1, $2, $3)",
          [product.id, warehouse.id, 50]
        );
      }
    }

    return {
      success: true,
      message: "Default data created successfully",
      data: {
        categories: categories.rows.length,
        warehouses: warehouses.rows.length,
        suppliers: suppliers.rows.length,
        customers: customers.rows.length,
        products: products.rows.length,
        stockLevels: products.rows.length * warehouses.rows.length
      }
    };
  } catch (err) {
    console.error("Error initializing default data:", err);
    throw err;
  }
};

module.exports = { initializeDefaultData };
