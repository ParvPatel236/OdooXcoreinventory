-- Insert Users
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@inventory.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Admin'),
('Manager User', 'manager@inventory.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'Inventory Manager'),
('Staff User', 'staff@inventory.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'Warehouse Staff');

-- Insert Categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Furniture', 'Office and home furniture'),
('Supplies', 'Office supplies and stationery'),
('Hardware', 'Computer hardware components'),
('Software', 'Software licenses and applications');

-- Insert Products
INSERT INTO products (name, sku, category_id, description, unit_price, min_stock, max_stock, reorder_quantity) VALUES
('Laptop Pro', 'LAP001', 1, 'High performance laptop', 1299.99, 5, 50, 10),
('Desktop Computer', 'DES001', 1, 'Desktop workstation', 899.99, 3, 30, 5),
('Monitor 27"', 'MON001', 1, '27 inch display', 349.99, 10, 100, 20),
('Keyboard Mechanical', 'KEY001', 1, 'Mechanical keyboard', 129.99, 15, 150, 30),
('Mouse Wireless', 'MOU001', 1, 'Wireless mouse', 49.99, 20, 200, 50),
('Office Chair', 'CHR001', 2, 'Ergonomic office chair', 299.99, 5, 50, 10),
('Desk Wooden', 'DSK001', 2, 'Wooden desk', 499.99, 3, 30, 5),
('Filing Cabinet', 'FIL001', 2, 'Metal filing cabinet', 199.99, 5, 50, 10),
('Printer Laser', 'PRT001', 1, 'Laser printer', 599.99, 2, 20, 5),
('Paper Ream', 'PAP001', 3, 'A4 paper ream', 5.99, 50, 500, 100),
('Pen Set', 'PEN001', 3, 'Ballpoint pen set', 12.99, 100, 1000, 200),
('Notebook', 'NOT001', 3, 'Spiral notebook', 3.99, 100, 1000, 200),
('SSD 1TB', 'SSD001', 4, 'Solid state drive', 99.99, 10, 100, 20),
('RAM 16GB', 'RAM001', 4, 'Memory module', 79.99, 15, 150, 30),
('Power Supply', 'PSU001', 4, 'Power supply unit', 89.99, 8, 80, 15);

-- Insert Warehouses
INSERT INTO warehouses (name, location, capacity) VALUES
('Main Warehouse', 'New York', 50000),
('Secondary Warehouse', 'Los Angeles', 30000),
('Regional Hub', 'Chicago', 20000),
('Distribution Center', 'Dallas', 40000);

-- Insert Stock Locations
INSERT INTO stock_locations (product_id, warehouse_id, quantity) VALUES
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

-- Insert Receipts
INSERT INTO receipts (receipt_number, warehouse_id, status, total_items, notes, created_by) VALUES
('REC001', 1, 'completed', 3, 'Initial stock shipment', 1),
('REC002', 2, 'completed', 3, 'Furniture delivery', 1),
('REC003', 1, 'completed', 3, 'Electronics shipment', 2),
('REC004', 3, 'completed', 3, 'Office supplies', 2),
('REC005', 4, 'completed', 3, 'Hardware components', 1);

-- Insert Receipt Items
INSERT INTO receipt_items (receipt_id, product_id, quantity, unit_price) VALUES
(1, 1, 50, 1200.00), (1, 2, 40, 850.00), (1, 3, 100, 320.00),
(2, 6, 30, 280.00), (2, 7, 20, 450.00), (2, 8, 40, 180.00),
(3, 9, 20, 550.00), (3, 4, 150, 120.00), (3, 5, 200, 45.00),
(4, 10, 400, 5.50), (4, 11, 800, 12.00), (4, 12, 600, 3.50),
(5, 13, 100, 95.00), (5, 14, 120, 75.00), (5, 15, 80, 85.00);

-- Insert Deliveries
INSERT INTO deliveries (delivery_number, warehouse_id, status, total_items, notes, created_by) VALUES
('DEL001', 1, 'completed', 3, 'Order #001', 1),
('DEL002', 2, 'completed', 3, 'Order #002', 2),
('DEL003', 1, 'completed', 3, 'Order #003', 1),
('DEL004', 3, 'completed', 3, 'Order #004', 2),
('DEL005', 4, 'completed', 3, 'Order #005', 1);

-- Insert Delivery Items
INSERT INTO delivery_items (delivery_id, product_id, quantity) VALUES
(1, 1, 5), (1, 3, 10), (1, 4, 20),
(2, 6, 3), (2, 7, 2), (2, 8, 5),
(3, 9, 2), (3, 2, 3), (3, 5, 15),
(4, 10, 50), (4, 11, 100), (4, 12, 80),
(5, 13, 10), (5, 14, 15), (5, 15, 8);

-- Insert Transfers
INSERT INTO transfers (transfer_number, from_warehouse_id, to_warehouse_id, status, total_items, notes, created_by) VALUES
('TRN001', 1, 2, 'completed', 1, 'Stock rebalancing', 1),
('TRN002', 1, 3, 'completed', 1, 'Regional distribution', 2),
('TRN003', 2, 4, 'completed', 1, 'Warehouse optimization', 1),
('TRN004', 1, 3, 'completed', 1, 'Supply redistribution', 2),
('TRN005', 2, 1, 'completed', 1, 'Stock consolidation', 1);

-- Insert Transfer Items
INSERT INTO transfer_items (transfer_id, product_id, quantity) VALUES
(1, 1, 20),
(2, 3, 30),
(3, 5, 25),
(4, 10, 100),
(5, 14, 15);

-- Insert Adjustments
INSERT INTO adjustments (adjustment_number, warehouse_id, status, reason, notes, created_by) VALUES
('ADJ001', 1, 'completed', 'damage', 'Damaged items removed', 1),
('ADJ002', 2, 'completed', 'correction', 'Inventory correction', 2),
('ADJ003', 3, 'completed', 'loss', 'Expired stock', 1),
('ADJ004', 1, 'completed', 'inventory_count', 'Recount adjustment', 2),
('ADJ005', 4, 'completed', 'damage', 'Defective units', 1);

-- Insert Adjustment Items
INSERT INTO adjustment_items (adjustment_id, product_id, quantity_change) VALUES
(1, 1, -5),
(2, 3, 10),
(3, 5, -3),
(4, 10, 50),
(5, 15, -2);

-- Insert Stock Ledger
INSERT INTO stock_ledger (product_id, warehouse_id, operation_type, quantity, reference_id, notes, created_by) VALUES
(1, 1, 'receipt', 50, 1, 'Receipt from supplier', 1),
(1, 1, 'delivery', -5, 1, 'Delivery to customer', 1),
(3, 2, 'transfer', 30, 1, 'Transfer from warehouse 1', 2),
(5, 3, 'adjustment', -3, 1, 'Adjustment - damaged', 1),
(10, 1, 'receipt', 100, 2, 'Receipt from supplier', 2),
(14, 2, 'transfer', -15, 2, 'Transfer to warehouse 1', 1),
(2, 1, 'delivery', -3, 2, 'Delivery to customer', 1),
(6, 2, 'receipt', 30, 2, 'Receipt from supplier', 2),
(9, 1, 'delivery', -2, 3, 'Delivery to customer', 1),
(12, 3, 'receipt', 50, 3, 'Receipt from supplier', 2);

-- Insert Barcodes
INSERT INTO barcodes (product_id, barcode_value, barcode_type) VALUES
(1, 'LAP001-1', 'code128'),
(2, 'DES001-2', 'code128'),
(3, 'MON001-3', 'code128'),
(4, 'KEY001-4', 'code128'),
(5, 'MOU001-5', 'code128'),
(6, 'CHR001-6', 'code128'),
(7, 'DSK001-7', 'code128'),
(8, 'FIL001-8', 'code128'),
(9, 'PRT001-9', 'code128'),
(10, 'PAP001-10', 'code128'),
(11, 'PEN001-11', 'code128'),
(12, 'NOT001-12', 'code128'),
(13, 'SSD001-13', 'code128'),
(14, 'RAM001-14', 'code128'),
(15, 'PSU001-15', 'code128');

-- Insert Stock Predictions
INSERT INTO stock_predictions (product_id, warehouse_id, current_stock, avg_daily_consumption, days_remaining, status) VALUES
(1, 1, 100, 2.5, 40, 'safe'),
(2, 1, 80, 1.5, 53, 'safe'),
(3, 1, 150, 3.0, 50, 'safe'),
(4, 1, 200, 5.0, 40, 'safe'),
(5, 1, 300, 8.0, 37, 'safe'),
(10, 1, 500, 15.0, 33, 'warning'),
(11, 1, 1000, 25.0, 40, 'safe'),
(12, 1, 800, 20.0, 40, 'safe'),
(13, 1, 120, 2.0, 60, 'safe'),
(14, 1, 150, 3.0, 50, 'safe');

-- Verify Data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Warehouses', COUNT(*) FROM warehouses
UNION ALL
SELECT 'Stock Locations', COUNT(*) FROM stock_locations
UNION ALL
SELECT 'Stock Ledger', COUNT(*) FROM stock_ledger
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
SELECT 'Transfer Items', COUNT(*) FROM transfer_items
UNION ALL
SELECT 'Adjustments', COUNT(*) FROM adjustments
UNION ALL
SELECT 'Adjustment Items', COUNT(*) FROM adjustment_items
UNION ALL
SELECT 'Barcodes', COUNT(*) FROM barcodes
UNION ALL
SELECT 'Stock Predictions', COUNT(*) FROM stock_predictions;
