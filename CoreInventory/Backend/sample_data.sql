-- Sample Data for Core Inventory Database

-- Insert Users
INSERT INTO users (email, password, name, role) VALUES
('admin@inventory.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Admin User', 'admin'),
('manager@inventory.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'Manager User', 'manager'),
('staff@inventory.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'Staff User', 'user');

-- Insert Categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Furniture', 'Office and home furniture'),
('Supplies', 'Office supplies and stationery'),
('Hardware', 'Computer hardware components'),
('Software', 'Software licenses and applications');

-- Insert Products
INSERT INTO products (name, sku, category_id, unit_price, reorder_level) VALUES
('Laptop Pro', 'LAP001', 1, 1299.99, 5),
('Desktop Computer', 'DES001', 1, 899.99, 3),
('Monitor 27"', 'MON001', 1, 349.99, 10),
('Keyboard Mechanical', 'KEY001', 1, 129.99, 15),
('Mouse Wireless', 'MOU001', 1, 49.99, 20),
('Office Chair', 'CHR001', 2, 299.99, 5),
('Desk Wooden', 'DSK001', 2, 499.99, 3),
('Filing Cabinet', 'FIL001', 2, 199.99, 5),
('Printer Laser', 'PRT001', 1, 599.99, 2),
('Paper Ream', 'PAP001', 3, 5.99, 50),
('Pen Set', 'PEN001', 3, 12.99, 100),
('Notebook', 'NOT001', 3, 3.99, 100),
('SSD 1TB', 'SSD001', 4, 99.99, 10),
('RAM 16GB', 'RAM001', 4, 79.99, 15),
('Power Supply', 'PSU001', 4, 89.99, 8);

-- Insert Warehouses
INSERT INTO warehouses (name, location, capacity) VALUES
('Main Warehouse', 'New York', 50000),
('Secondary Warehouse', 'Los Angeles', 30000),
('Regional Hub', 'Chicago', 20000),
('Distribution Center', 'Dallas', 40000);

-- Insert Stock Levels
INSERT INTO stock_levels (product_id, warehouse_id, quantity) VALUES
(1, 1, 100), (1, 2, 50), (1, 3, 30), (1, 4, 40),
(2, 1, 80), (2, 2, 40), (2, 3, 20), (2, 4, 30),
(3, 1, 150), (3, 2, 100), (3, 3, 50), (3, 4, 80),
(4, 1, 200), (4, 2, 150), (4, 3, 100), (4, 4, 120),
(5, 1, 300), (5, 2, 200), (5, 3, 150), (5, 4, 180),
(6, 1, 50), (6, 2, 30), (6, 3, 20), (6, 4, 25),
(7, 1, 40), (7, 2, 25), (7, 3, 15), (7, 4, 20),
(8, 1, 60), (8, 2, 40), (8, 3, 25), (8, 4, 35),
(9, 1, 25), (9, 2, 15), (9, 3, 10), (9, 4, 12),
(10, 1, 500), (10, 2, 300), (10, 3, 200), (10, 4, 250),
(11, 1, 1000), (11, 2, 800), (11, 3, 600), (11, 4, 700),
(12, 1, 800), (12, 2, 600), (12, 3, 400), (12, 4, 500),
(13, 1, 120), (13, 2, 80), (13, 3, 50), (13, 4, 70),
(14, 1, 150), (14, 2, 100), (14, 3, 60), (14, 4, 80),
(15, 1, 100), (15, 2, 70), (15, 3, 40), (15, 4, 60);

-- Insert Suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('Tech Supplies Inc', 'John Smith', 'john@techsupplies.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA'),
('Office Furniture Co', 'Sarah Johnson', 'sarah@officefurniture.com', '+1-555-0102', '456 Furniture Ave, Los Angeles, CA'),
('Global Electronics', 'Mike Chen', 'mike@globalelectronics.com', '+1-555-0103', '789 Electronics Blvd, New York, NY'),
('Paper & Supplies Ltd', 'Emma Davis', 'emma@papersupplies.com', '+1-555-0104', '321 Supply Lane, Chicago, IL'),
('Hardware Components', 'David Wilson', 'david@hardwarecomp.com', '+1-555-0105', '654 Hardware Dr, Dallas, TX');

-- Insert Customers
INSERT INTO customers (name, contact_person, email, phone, address) VALUES
('ABC Corporation', 'Jane Doe', 'jane@abccorp.com', '+1-555-0201', '111 Business Ave, New York, NY'),
('XYZ Industries', 'Robert Brown', 'robert@xyzind.com', '+1-555-0202', '222 Industrial Blvd, Los Angeles, CA'),
('Tech Startup Inc', 'Lisa Anderson', 'lisa@techstartup.com', '+1-555-0203', '333 Innovation Dr, San Francisco, CA'),
('Global Enterprises', 'James Martinez', 'james@globalent.com', '+1-555-0204', '444 Enterprise Way, Chicago, IL'),
('Local Business LLC', 'Maria Garcia', 'maria@localbiz.com', '+1-555-0205', '555 Local St, Dallas, TX');

-- Insert Receipts (Incoming Stock)
INSERT INTO receipts (supplier_id, warehouse_id, user_id, status, notes) VALUES
(1, 1, 1, 'completed', 'Initial stock shipment from Tech Supplies'),
(2, 2, 1, 'completed', 'Furniture delivery from Office Furniture Co'),
(3, 1, 2, 'completed', 'Electronics shipment from Global Electronics'),
(4, 3, 2, 'completed', 'Office supplies from Paper & Supplies Ltd'),
(5, 4, 1, 'completed', 'Hardware components from Hardware Components');

-- Insert Receipt Items
INSERT INTO receipt_items (receipt_id, product_id, quantity, unit_price) VALUES
(1, 1, 50, 1200.00), (1, 2, 40, 850.00), (1, 3, 100, 320.00),
(2, 6, 30, 280.00), (2, 7, 20, 450.00), (2, 8, 40, 180.00),
(3, 9, 20, 550.00), (3, 4, 150, 120.00), (3, 5, 200, 45.00),
(4, 10, 400, 5.50), (4, 11, 800, 12.00), (4, 12, 600, 3.50),
(5, 13, 100, 95.00), (5, 14, 120, 75.00), (5, 15, 80, 85.00);

-- Insert Deliveries (Outgoing Stock)
INSERT INTO deliveries (customer_id, warehouse_id, user_id, status, notes) VALUES
(1, 1, 1, 'completed', 'Order #001 - ABC Corporation'),
(2, 2, 2, 'completed', 'Order #002 - XYZ Industries'),
(3, 1, 1, 'completed', 'Order #003 - Tech Startup Inc'),
(4, 3, 2, 'completed', 'Order #004 - Global Enterprises'),
(5, 4, 1, 'completed', 'Order #005 - Local Business LLC');

-- Insert Delivery Items
INSERT INTO delivery_items (delivery_id, product_id, quantity, unit_price) VALUES
(1, 1, 5, 1299.99), (1, 3, 10, 349.99), (1, 4, 20, 129.99),
(2, 6, 3, 299.99), (2, 7, 2, 499.99), (2, 8, 5, 199.99),
(3, 9, 2, 599.99), (3, 2, 3, 899.99), (3, 5, 15, 49.99),
(4, 10, 50, 5.99), (4, 11, 100, 12.99), (4, 12, 80, 3.99),
(5, 13, 10, 99.99), (5, 14, 15, 79.99), (5, 15, 8, 89.99);

-- Insert Transfers (Inter-warehouse)
INSERT INTO transfers (product_id, from_warehouse_id, to_warehouse_id, quantity, user_id, notes) VALUES
(1, 1, 2, 20, 1, 'Stock rebalancing'),
(3, 1, 3, 30, 2, 'Regional distribution'),
(5, 2, 4, 25, 1, 'Warehouse optimization'),
(10, 1, 3, 100, 2, 'Supply redistribution'),
(14, 2, 1, 15, 1, 'Stock consolidation');

-- Insert Adjustments
INSERT INTO adjustments (product_id, warehouse_id, adjustment_type, quantity, reason, user_id) VALUES
(1, 1, 'decrease', 5, 'Damaged items removed', 1),
(3, 2, 'increase', 10, 'Inventory correction', 2),
(5, 3, 'decrease', 3, 'Expired stock', 1),
(10, 1, 'increase', 50, 'Recount adjustment', 2),
(15, 4, 'decrease', 2, 'Defective units', 1);

-- Insert Movements (Stock Movements)
INSERT INTO movements (product_id, warehouse_id, movement_type, quantity, user_id, notes) VALUES
(1, 1, 'inbound', 50, 1, 'Receipt from supplier'),
(1, 1, 'outbound', 5, 1, 'Delivery to customer'),
(3, 2, 'inbound', 30, 2, 'Transfer from warehouse 1'),
(5, 3, 'outbound', 3, 1, 'Adjustment - damaged'),
(10, 1, 'inbound', 100, 2, 'Receipt from supplier'),
(14, 2, 'outbound', 15, 1, 'Transfer to warehouse 1'),
(2, 1, 'outbound', 3, 1, 'Delivery to customer'),
(6, 2, 'inbound', 30, 2, 'Receipt from supplier'),
(9, 1, 'outbound', 2, 1, 'Delivery to customer'),
(12, 3, 'inbound', 50, 2, 'Receipt from supplier');

-- Insert Barcodes
INSERT INTO barcodes (product_id, barcode_value) VALUES
(1, '5901234123457'),
(2, '5901234123458'),
(3, '5901234123459'),
(4, '5901234123460'),
(5, '5901234123461'),
(6, '5901234123462'),
(7, '5901234123463'),
(8, '5901234123464'),
(9, '5901234123465'),
(10, '5901234123466'),
(11, '5901234123467'),
(12, '5901234123468'),
(13, '5901234123469'),
(14, '5901234123470'),
(15, '5901234123471');

-- Verify Data Insertion
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
