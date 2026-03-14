-- Delete All Sample Data
-- Run this to clear the database and start fresh

-- Disable foreign key constraints temporarily
ALTER TABLE audit_logs DISABLE TRIGGER ALL;
ALTER TABLE barcodes DISABLE TRIGGER ALL;
ALTER TABLE movements DISABLE TRIGGER ALL;
ALTER TABLE adjustments DISABLE TRIGGER ALL;
ALTER TABLE transfers DISABLE TRIGGER ALL;
ALTER TABLE delivery_items DISABLE TRIGGER ALL;
ALTER TABLE deliveries DISABLE TRIGGER ALL;
ALTER TABLE receipt_items DISABLE TRIGGER ALL;
ALTER TABLE receipts DISABLE TRIGGER ALL;
ALTER TABLE stock_levels DISABLE TRIGGER ALL;
ALTER TABLE customers DISABLE TRIGGER ALL;
ALTER TABLE suppliers DISABLE TRIGGER ALL;
ALTER TABLE products DISABLE TRIGGER ALL;
ALTER TABLE warehouses DISABLE TRIGGER ALL;
ALTER TABLE categories DISABLE TRIGGER ALL;
ALTER TABLE users DISABLE TRIGGER ALL;

-- Delete all data
DELETE FROM audit_logs;
DELETE FROM barcodes;
DELETE FROM movements;
DELETE FROM adjustments;
DELETE FROM transfers;
DELETE FROM delivery_items;
DELETE FROM deliveries;
DELETE FROM receipt_items;
DELETE FROM receipts;
DELETE FROM stock_levels;
DELETE FROM customers;
DELETE FROM suppliers;
DELETE FROM products;
DELETE FROM warehouses;
DELETE FROM categories;
DELETE FROM users;

-- Re-enable foreign key constraints
ALTER TABLE audit_logs ENABLE TRIGGER ALL;
ALTER TABLE barcodes ENABLE TRIGGER ALL;
ALTER TABLE movements ENABLE TRIGGER ALL;
ALTER TABLE adjustments ENABLE TRIGGER ALL;
ALTER TABLE transfers ENABLE TRIGGER ALL;
ALTER TABLE delivery_items ENABLE TRIGGER ALL;
ALTER TABLE deliveries ENABLE TRIGGER ALL;
ALTER TABLE receipt_items ENABLE TRIGGER ALL;
ALTER TABLE receipts ENABLE TRIGGER ALL;
ALTER TABLE stock_levels ENABLE TRIGGER ALL;
ALTER TABLE customers ENABLE TRIGGER ALL;
ALTER TABLE suppliers ENABLE TRIGGER ALL;
ALTER TABLE products ENABLE TRIGGER ALL;
ALTER TABLE warehouses ENABLE TRIGGER ALL;
ALTER TABLE categories ENABLE TRIGGER ALL;
ALTER TABLE users ENABLE TRIGGER ALL;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE warehouses_id_seq RESTART WITH 1;
ALTER SEQUENCE stock_levels_id_seq RESTART WITH 1;
ALTER SEQUENCE movements_id_seq RESTART WITH 1;
ALTER SEQUENCE suppliers_id_seq RESTART WITH 1;
ALTER SEQUENCE receipts_id_seq RESTART WITH 1;
ALTER SEQUENCE receipt_items_id_seq RESTART WITH 1;
ALTER SEQUENCE customers_id_seq RESTART WITH 1;
ALTER SEQUENCE deliveries_id_seq RESTART WITH 1;
ALTER SEQUENCE delivery_items_id_seq RESTART WITH 1;
ALTER SEQUENCE transfers_id_seq RESTART WITH 1;
ALTER SEQUENCE adjustments_id_seq RESTART WITH 1;
ALTER SEQUENCE barcodes_id_seq RESTART WITH 1;
ALTER SEQUENCE audit_logs_id_seq RESTART WITH 1;

-- Verify all tables are empty
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Warehouses', COUNT(*) FROM warehouses
UNION ALL
SELECT 'Stock Levels', COUNT(*) FROM stock_levels
UNION ALL
SELECT 'Suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Receipts', COUNT(*) FROM receipts
UNION ALL
SELECT 'Receipt Items', COUNT(*) FROM receipt_items
UNION ALL
SELECT 'Deliveries', COUNT(*) FROM deliveries
UNION ALL
SELECT 'Delivery Items', COUNT(*) FROM delivery_items
UNION ALL
SELECT 'Transfers', COUNT(*) FROM transfers
UNION ALL
SELECT 'Adjustments', COUNT(*) FROM adjustments
UNION ALL
SELECT 'Movements', COUNT(*) FROM movements
UNION ALL
SELECT 'Barcodes', COUNT(*) FROM barcodes;
