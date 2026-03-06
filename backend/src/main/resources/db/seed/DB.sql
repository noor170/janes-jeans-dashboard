-- ============================================================
-- Jane's Jeans – Seed / Demo Data
-- Run after Liquibase schema migrations.
-- Safe to re-run: uses INSERT … ON CONFLICT DO NOTHING
-- ============================================================

-- ====================
-- 1. USERS
-- ====================
-- admin@gmail.com / Admin@123456 | admin@janesjeans.com / admin123 | all others / admin123
INSERT INTO users (id, email, password, first_name, last_name, role, is_active) VALUES
('usr-root-admin-001', 'admin@gmail.com',       '$2a$10$Wv3wxZnVTkOKpEclr4JCauFBwyMrPX2rJSKfGxN1FJqcOqsKqWqXO', 'Root',      'Admin',       'SUPER_ADMIN', true),
('usr-super-admin-001','admin@janesjeans.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Super',     'Admin',       'SUPER_ADMIN', true),
('usr-admin-001',      'manager@janesjeans.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Store',     'Manager',     'ADMIN',       true),
('usr-admin-002',      'warehouse@janesjeans.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi','Warehouse', 'Admin',       'ADMIN',       true),
('usr-staff-001',      'staff@janesjeans.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Sales',     'Staff',       'USER',        true),
('usr-staff-002',      'support@janesjeans.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Customer',  'Support',     'USER',        true),
('usr-staff-003',      'marketing@janesjeans.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi','Marketing', 'Team',        'USER',        true),
('usr-staff-004',      'shipping@janesjeans.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Shipping',  'Coordinator', 'USER',        true),
('usr-staff-005',      'finance@janesjeans.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Finance',   'Officer',     'USER',        true),
('usr-staff-006',      'designer@janesjeans.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Product',   'Designer',    'USER',        true),
('usr-user-001',       'user@janesjeans.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Regular',   'User',        'USER',        true),
('usr-user-002',       'buyer1@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Alice',     'Buyer',       'USER',        true),
('usr-user-003',       'buyer2@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Bob',       'Shopper',     'USER',        true),
('usr-user-004',       'buyer3@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Carol',     'Consumer',    'USER',        true),
('usr-user-005',       'buyer4@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Daniel',    'Client',      'USER',        true),
('usr-user-006',       'buyer5@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Eva',       'Patron',      'USER',        true),
('usr-user-007',       'buyer6@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Frank',     'Purchaser',   'USER',        true),
('usr-user-008',       'buyer7@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Grace',     'Customer',    'USER',        true),
('usr-inactive-001',   'inactive@janesjeans.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', 'Inactive',  'User',        'USER',        false),
('usr-inactive-002',   'suspended@janesjeans.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi','Suspended', 'Account',     'USER',        false),
('usr-system-admin-001','admin@admin.com',       '$2a$10$FjMY6ALCVk7Dg3HqbZnExuL.j7Xr0OpB1jCWzZoKZfOLzzRKr4y.', 'System',    'Admin',       'SUPER_ADMIN', true)
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 2. PRODUCTS
-- ====================
INSERT INTO products (id, name, description, gender, fit, size, wash, price, stock_level, image_url) VALUES
('P001','Classic Indigo Slim','Timeless slim-fit jeans in classic indigo wash','Men','Slim','32','Dark Indigo',89.99,45,'/images/products/mens-slim-dark.jpg'),
('P002','Urban Skinny Fit','Modern skinny jeans for urban style','Men','Skinny','30','Black',79.99,8,'/images/products/mens-skinny-black.jpg'),
('P003','Comfort Relaxed','Relaxed fit for all-day comfort','Men','Relaxed','34','Stone Wash',74.99,32,'/images/products/mens-relaxed-light.jpg'),
('P004','Premium Slim Dark','Premium quality raw denim slim jeans','Men','Slim','32','Raw Denim',129.99,5,'/images/products/mens-slim-navy.jpg'),
('P005','Weekend Relaxed','Perfect for casual weekends','Men','Relaxed','36','Light Blue',69.99,28,'/images/products/mens-relaxed-light.jpg'),
('P006','Street Skinny','Edgy skinny fit for street style','Men','Skinny','28','Washed Black',84.99,3,'/images/products/mens-skinny-black.jpg'),
('P007','Executive Slim','Professional slim fit for the office','Men','Slim','33','Deep Navy',99.99,18,'/images/products/mens-slim-navy.jpg'),
('P008','Vintage Relaxed','Vintage wash relaxed fit','Men','Relaxed','35','Vintage Wash',79.99,22,'/images/products/mens-relaxed-vintage.jpg'),
('P009','High Rise Skinny','Flattering high rise skinny jeans','Women','Skinny','26','Dark Indigo',89.99,42,'/images/products/womens-skinny-dark.jpg'),
('P010','Mom Fit Relaxed','Classic mom jeans with relaxed fit','Women','Relaxed','28','Light Wash',79.99,6,'/images/products/womens-relaxed-light.jpg'),
('P011','Ankle Slim','Chic ankle-length slim jeans','Women','Slim','27','Medium Blue',84.99,35,'/images/products/womens-slim-blue.jpg'),
('P012','Curve Skinny','Designed for curves skinny fit','Women','Skinny','29','Black',94.99,9,'/images/products/womens-skinny-black.jpg'),
('P013','Wide Leg Relaxed','Trendy wide leg relaxed jeans','Women','Relaxed','26','Stone Wash',99.99,27,'/images/products/womens-relaxed-wide.jpg'),
('P014','Cropped Slim','Stylish cropped slim jeans','Women','Slim','25','Bleached',74.99,4,'/images/products/womens-relaxed-light.jpg'),
('P015','Bootcut Slim','Classic bootcut slim jeans','Women','Slim','28','Dark Wash',89.99,31,'/images/products/womens-slim-bootcut.jpg'),
('P016','Stretch Skinny','Super stretch skinny jeans','Women','Skinny','27','Midnight Blue',84.99,19,'/images/products/womens-skinny-dark.jpg'),
('P017','Distressed Slim','Trendy distressed slim fit','Men','Slim','31','Ripped Blue',94.99,14,'/images/products/mens-slim-ripped.jpg'),
('P018','Boyfriend Relaxed','Oversized boyfriend jeans','Women','Relaxed','27','Acid Wash',84.99,16,'/images/products/womens-relaxed-boyfriend.jpg'),
('P019','Athletic Slim','Athletic taper slim jeans','Men','Slim','34','Dark Navy',109.99,21,'/images/products/mens-slim-navy.jpg'),
('P020','Flare Leg','Retro flare leg jeans','Women','Relaxed','28','Medium Wash',89.99,12,'/images/products/womens-flare-medium.jpg')
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 3. CUSTOMERS
-- ====================
INSERT INTO customers (id, name, email, phone, address, status, total_orders, total_spent, notes) VALUES
('CUS001','John Smith','john.smith@email.com','+1 (555) 123-4567','123 Main St, New York, NY 10001','vip',12,1549.88,'Prefers express shipping.'),
('CUS002','Sarah Johnson','sarah.j@email.com','+1 (555) 234-5678','456 Oak Ave, Los Angeles, CA 90001','active',5,449.95,NULL),
('CUS003','Michael Brown','mbrown@email.com','+1 (555) 345-6789','789 Pine Rd, Chicago, IL 60601','active',8,879.92,NULL),
('CUS004','Emily Davis','emily.d@email.com','+1 (555) 456-7890','321 Elm St, Houston, TX 77001','active',3,269.97,NULL),
('CUS005','David Wilson','dwilson@email.com','+1 (555) 567-8901','555 Maple Dr, Phoenix, AZ 85001','inactive',1,129.99,'Account inactive.'),
('CUS006','Jessica Martinez','jmartinez@email.com','+1 (555) 678-9012','888 Cedar Ln, Philadelphia, PA 19101','vip',15,2124.85,'Top customer.'),
('CUS007','Robert Taylor','rtaylor@email.com','+1 (555) 789-0123','999 Birch Blvd, San Antonio, TX 78201','active',4,359.96,NULL),
('CUS008','Amanda White','awhite@email.com','+1 (555) 890-1234','111 Spruce Way, San Diego, CA 92101','active',6,509.94,NULL),
('CUS009','Chris Anderson','canderson@email.com','+1 (555) 901-2345','222 Walnut St, Dallas, TX 75201','active',7,629.93,NULL),
('CUS010','Laura Thomas','lthomas@email.com','+1 (555) 012-3456','333 Ash Ave, San Jose, CA 95101','vip',20,2899.80,'Loyalty platinum member.'),
('CUS011','Kevin Harris','kharris@email.com','+1 (555) 111-2222','444 Poplar Dr, Austin, TX 73301','active',2,179.98,NULL),
('CUS012','Michelle Clark','mclark@email.com','+1 (555) 222-3333','555 Hickory Ln, Jacksonville, FL 32099','active',9,764.91,NULL),
('CUS013','James Lewis','jlewis@email.com','+1 (555) 333-4444','666 Cypress Ct, Fort Worth, TX 76101','active',6,539.94,NULL),
('CUS014','Patricia Robinson','probinson@email.com','+1 (555) 444-5555','777 Magnolia Way, Columbus, OH 43085','inactive',1,89.99,NULL),
('CUS015','Daniel Walker','dwalker@email.com','+1 (555) 555-6666','888 Redwood Blvd, Charlotte, NC 28201','active',11,989.89,NULL),
('CUS016','Nancy Young','nyoung@email.com','+1 (555) 666-7777','999 Sequoia Dr, San Francisco, CA 94101','vip',18,2459.82,NULL),
('CUS017','Steven King','sking@email.com','+1 (555) 777-8888','100 Palm St, Indianapolis, IN 46201','active',3,254.97,NULL),
('CUS018','Betty Wright','bwright@email.com','+1 (555) 888-9999','200 Olive Ave, Seattle, WA 98101','active',5,424.95,NULL),
('CUS019','Mark Lopez','mlopez@email.com','+1 (555) 999-0000','300 Peach Rd, Denver, CO 80201','active',4,339.96,NULL),
('CUS020','Sandra Hill','shill@email.com','+1 (555) 000-1111','400 Cherry Ln, Nashville, TN 37201','active',7,594.93,NULL)
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 4. SHIPPING VENDORS
-- ====================
INSERT INTO shipping_vendors (id, name, code, contact_email, contact_phone, website, tracking_url_template, status, avg_delivery_days) VALUES
('VND001','Pathao','PATHAO','business@pathao.com','+880 9666-777777','https://pathao.com','https://pathao.com/track/{tracking_number}','active',3),
('VND002','Steadfast','STEADFAST','support@steadfast.com.bd','+880 9612-123456','https://steadfast.com.bd','https://steadfast.com.bd/track/{tracking_number}','active',2),
('VND003','Redx','REDX','info@redx.com.bd','+880 9613-789012','https://redx.com.bd','https://redx.com.bd/track/{tracking_number}','active',4),
('VND004','Paperfly','PAPERFLY','contact@paperfly.com.bd','+880 9614-456789','https://paperfly.com.bd',NULL,'inactive',5),
('VND005','Sundarban Courier','SUNDARBAN','info@sundarban.com','+880 9615-111222','https://sundarban.com','https://sundarban.com/track/{tracking_number}','active',5),
('VND006','SA Paribahan','SAPARIBAHAN','info@saparibahan.com','+880 9616-333444','https://saparibahan.com','https://saparibahan.com/track/{tracking_number}','active',4),
('VND007','Continental Courier','CONTINENTAL','info@continental.com.bd','+880 9617-555666','https://continental.com.bd',NULL,'active',3),
('VND008','E-Courier','ECOURIER','support@ecourier.com.bd','+880 9618-777888','https://ecourier.com.bd','https://ecourier.com.bd/track/{tracking_number}','active',2),
('VND009','Delhivery','DELHIVERY','support@delhivery.com','+91 1800-345-6789','https://delhivery.com','https://delhivery.com/track/{tracking_number}','active',3),
('VND010','FedEx Express','FEDEX','support@fedex.com','+1 800-463-3339','https://fedex.com','https://fedex.com/track?trknbr={tracking_number}','active',2),
('VND011','DHL Global','DHL','express@dhl.com','+1 800-225-5345','https://dhl.com','https://dhl.com/track?id={tracking_number}','active',3),
('VND012','UPS Worldwide','UPS','support@ups.com','+1 800-742-5877','https://ups.com','https://ups.com/track?tracknum={tracking_number}','active',3),
('VND013','Aramex','ARAMEX','info@aramex.com','+971 600-544000','https://aramex.com','https://aramex.com/track/{tracking_number}','active',5),
('VND014','BlueDart','BLUEDART','support@bluedart.com','+91 1860-233-1234','https://bluedart.com','https://bluedart.com/track/{tracking_number}','active',2),
('VND015','DTDC','DTDC','care@dtdc.com','+91 1800-111-0500','https://dtdc.com','https://dtdc.com/track/{tracking_number}','active',4),
('VND016','TNT Express','TNT','info@tnt.com','+31 800-1234567','https://tnt.com',NULL,'inactive',6),
('VND017','J&T Express','JNT','support@jtexpress.com','+62 021-80661888','https://jtexpress.com','https://jtexpress.com/track/{tracking_number}','active',3),
('VND018','Ninja Van','NINJAVAN','support@ninjavan.co','+65 6602-8271','https://ninjavan.co','https://ninjavan.co/track/{tracking_number}','active',3),
('VND019','GLS Courier','GLS','info@gls-group.eu','+49 6677-2098','https://gls-group.eu','https://gls-group.eu/track/{tracking_number}','active',4),
('VND020','Royal Mail','ROYALMAIL','support@royalmail.com','+44 345-774-0740','https://royalmail.com','https://royalmail.com/track/{tracking_number}','active',5)
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 5. ORDERS
-- ====================
INSERT INTO orders (id, customer_id, customer_name, customer_email, status, total_amount, shipping_address, notes, order_date, shipped_date, delivered_date) VALUES
('ORD001','CUS001','John Smith','john.smith@email.com','Delivered',254.97,'123 Main St, New York, NY 10001','VIP Customer','2024-01-15 10:30:00','2024-01-16 14:00:00','2024-01-19 11:00:00'),
('ORD002','CUS002','Sarah Johnson','sarah.j@email.com','Shipped',89.99,'456 Oak Ave, Los Angeles, CA 90001',NULL,'2024-01-18 14:45:00','2024-01-19 09:00:00',NULL),
('ORD003','CUS003','Michael Brown','mbrown@email.com','Processing',179.98,'789 Pine Rd, Chicago, IL 60601','Express shipping requested.','2024-01-20 09:15:00',NULL,NULL),
('ORD004','CUS004','Emily Davis','emily.d@email.com','Pending',269.97,'321 Elm St, Houston, TX 77001',NULL,'2024-01-21 16:30:00',NULL,NULL),
('ORD005','CUS005','David Wilson','dwilson@email.com','Pending',129.99,'555 Maple Dr, Phoenix, AZ 85001',NULL,'2024-01-21 18:00:00',NULL,NULL),
('ORD006','CUS006','Jessica Martinez','jmartinez@email.com','Processing',254.97,'888 Cedar Ln, Philadelphia, PA 19101',NULL,'2024-01-20 11:45:00',NULL,NULL),
('ORD007','CUS007','Robert Taylor','rtaylor@email.com','Delivered',169.98,'999 Birch Blvd, San Antonio, TX 78201',NULL,'2024-01-10 08:00:00','2024-01-11 10:00:00','2024-01-14 15:00:00'),
('ORD008','CUS008','Amanda White','awhite@email.com','Shipped',174.98,'111 Spruce Way, San Diego, CA 92101',NULL,'2024-01-19 13:20:00','2024-01-20 08:30:00',NULL),
('ORD009','CUS009','Chris Anderson','canderson@email.com','Pending',194.98,'222 Walnut St, Dallas, TX 75201',NULL,'2024-01-22 10:00:00',NULL,NULL),
('ORD010','CUS010','Laura Thomas','lthomas@email.com','Delivered',359.97,'333 Ash Ave, San Jose, CA 95101','Platinum member - priority shipping.','2024-01-08 09:00:00','2024-01-08 16:00:00','2024-01-10 12:00:00'),
('ORD011','CUS011','Kevin Harris','kharris@email.com','Processing',84.99,'444 Poplar Dr, Austin, TX 73301',NULL,'2024-01-22 14:30:00',NULL,NULL),
('ORD012','CUS012','Michelle Clark','mclark@email.com','Shipped',164.98,'555 Hickory Ln, Jacksonville, FL 32099',NULL,'2024-01-17 11:00:00','2024-01-18 15:00:00',NULL),
('ORD013','CUS013','James Lewis','jlewis@email.com','Delivered',159.98,'666 Cypress Ct, Fort Worth, TX 76101',NULL,'2024-01-05 10:00:00','2024-01-06 09:00:00','2024-01-09 14:00:00'),
('ORD014','CUS015','Daniel Walker','dwalker@email.com','Processing',219.98,'888 Redwood Blvd, Charlotte, NC 28201',NULL,'2024-01-22 16:00:00',NULL,NULL),
('ORD015','CUS016','Nancy Young','nyoung@email.com','Delivered',284.97,'999 Sequoia Dr, San Francisco, CA 94101','VIP member - gift wrap requested.','2024-01-12 09:30:00','2024-01-12 17:00:00','2024-01-15 10:00:00'),
('ORD016','CUS017','Steven King','sking@email.com','Pending',84.99,'100 Palm St, Indianapolis, IN 46201',NULL,'2024-01-23 08:00:00',NULL,NULL),
('ORD017','CUS018','Betty Wright','bwright@email.com','Shipped',174.98,'200 Olive Ave, Seattle, WA 98101',NULL,'2024-01-19 15:00:00','2024-01-20 11:00:00',NULL),
('ORD018','CUS019','Mark Lopez','mlopez@email.com','Processing',199.98,'300 Peach Rd, Denver, CO 80201',NULL,'2024-01-22 12:00:00',NULL,NULL),
('ORD019','CUS020','Sandra Hill','shill@email.com','Delivered',164.98,'400 Cherry Ln, Nashville, TN 37201',NULL,'2024-01-07 11:30:00','2024-01-08 09:00:00','2024-01-11 16:00:00'),
('ORD020','CUS010','Laura Thomas','lthomas@email.com','Pending',239.98,'333 Ash Ave, San Jose, CA 95101','Second order this month - loyalty discount applied.','2024-01-23 10:00:00',NULL,NULL)
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 6. ORDER ITEMS
-- ====================
INSERT INTO order_items (id, order_id, product_id, product_name, size, quantity, price) VALUES
('OI001-1','ORD001','P001','Classic Indigo Slim','32',2,89.99),
('OI001-2','ORD001','P003','Comfort Relaxed','34',1,74.99),
('OI002-1','ORD002','P009','High Rise Skinny','26',1,89.99),
('OI003-1','ORD003','P002','Urban Skinny Fit','30',1,79.99),
('OI003-2','ORD003','P007','Executive Slim','33',1,99.99),
('OI004-1','ORD004','P011','Ankle Slim','27',2,84.99),
('OI004-2','ORD004','P013','Wide Leg Relaxed','26',1,99.99),
('OI005-1','ORD005','P004','Premium Slim Dark','32',1,129.99),
('OI006-1','ORD006','P016','Stretch Skinny','27',3,84.99),
('OI007-1','ORD007','P005','Weekend Relaxed','36',1,69.99),
('OI007-2','ORD007','P007','Executive Slim','33',1,99.99),
('OI008-1','ORD008','P010','Mom Fit Relaxed','28',1,79.99),
('OI008-2','ORD008','P012','Curve Skinny','29',1,94.99),
('OI009-1','ORD009','P017','Distressed Slim','31',1,94.99),
('OI009-2','ORD009','P007','Executive Slim','33',1,99.99),
('OI010-1','ORD010','P004','Premium Slim Dark','32',1,129.99),
('OI010-2','ORD010','P019','Athletic Slim','34',1,109.99),
('OI010-3','ORD010','P020','Flare Leg','28',1,89.99),
('OI011-1','ORD011','P006','Street Skinny','28',1,84.99),
('OI012-1','ORD012','P014','Cropped Slim','25',1,74.99),
('OI012-2','ORD012','P015','Bootcut Slim','28',1,89.99),
('OI013-1','ORD013','P001','Classic Indigo Slim','32',1,89.99),
('OI013-2','ORD013','P005','Weekend Relaxed','36',1,69.99),
('OI014-1','ORD014','P004','Premium Slim Dark','32',1,129.99),
('OI014-2','ORD014','P008','Vintage Relaxed','35',1,79.99),
('OI015-1','ORD015','P009','High Rise Skinny','26',1,89.99),
('OI015-2','ORD015','P013','Wide Leg Relaxed','26',1,99.99),
('OI015-3','ORD015','P012','Curve Skinny','29',1,94.99),
('OI016-1','ORD016','P018','Boyfriend Relaxed','27',1,84.99),
('OI017-1','ORD017','P011','Ankle Slim','27',1,84.99),
('OI017-2','ORD017','P020','Flare Leg','28',1,89.99),
('OI018-1','ORD018','P019','Athletic Slim','34',1,109.99),
('OI018-2','ORD018','P001','Classic Indigo Slim','32',1,89.99),
('OI019-1','ORD019','P003','Comfort Relaxed','34',1,74.99),
('OI019-2','ORD019','P009','High Rise Skinny','26',1,89.99),
('OI020-1','ORD020','P017','Distressed Slim','31',1,94.99),
('OI020-2','ORD020','P015','Bootcut Slim','28',1,89.99)
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 7. SHIPMENTS
-- ====================
INSERT INTO shipments (id, order_id, vendor_id, tracking_number, status, shipping_address, shipped_at, estimated_delivery, delivered_at) VALUES
('SHP001','ORD001','VND001','PTH123456789','delivered','123 Main St, New York, NY 10001','2024-01-16 14:00:00','2024-01-19 18:00:00','2024-01-19 11:00:00'),
('SHP002','ORD002','VND002','STF987654321','in_transit','456 Oak Ave, Los Angeles, CA 90001','2024-01-19 09:00:00','2024-01-21 18:00:00',NULL),
('SHP003','ORD003','VND001','PTH456789123','pending','789 Pine Rd, Chicago, IL 60601',NULL,'2024-01-25 18:00:00',NULL),
('SHP004','ORD007','VND003','RDX111222333','delivered','999 Birch Blvd, San Antonio, TX 78201','2024-01-11 10:00:00','2024-01-15 18:00:00','2024-01-14 15:00:00'),
('SHP005','ORD008','VND005','SUN444555666','in_transit','111 Spruce Way, San Diego, CA 92101','2024-01-20 08:30:00','2024-01-25 18:00:00',NULL),
('SHP006','ORD010','VND010','FDX777888999','delivered','333 Ash Ave, San Jose, CA 95101','2024-01-08 16:00:00','2024-01-10 18:00:00','2024-01-10 12:00:00'),
('SHP007','ORD012','VND008','ECR101112131','in_transit','555 Hickory Ln, Jacksonville, FL 32099','2024-01-18 15:00:00','2024-01-20 18:00:00',NULL),
('SHP008','ORD013','VND006','SAP141516171','delivered','666 Cypress Ct, Fort Worth, TX 76101','2024-01-06 09:00:00','2024-01-10 18:00:00','2024-01-09 14:00:00'),
('SHP009','ORD015','VND011','DHL181920212','delivered','999 Sequoia Dr, San Francisco, CA 94101','2024-01-12 17:00:00','2024-01-15 18:00:00','2024-01-15 10:00:00'),
('SHP010','ORD017','VND012','UPS222324252','in_transit','200 Olive Ave, Seattle, WA 98101','2024-01-20 11:00:00','2024-01-23 18:00:00',NULL),
('SHP011','ORD019','VND007','CNT262728293','delivered','400 Cherry Ln, Nashville, TN 37201','2024-01-08 09:00:00','2024-01-11 18:00:00','2024-01-11 16:00:00'),
('SHP012','ORD006','VND002','STF303132333','pending','888 Cedar Ln, Philadelphia, PA 19101',NULL,'2024-01-24 18:00:00',NULL),
('SHP013','ORD011','VND009','DLV343536373','pending','444 Poplar Dr, Austin, TX 73301',NULL,'2024-01-26 18:00:00',NULL),
('SHP014','ORD014','VND013','ARX383940414','pending','888 Redwood Blvd, Charlotte, NC 28201',NULL,'2024-01-28 18:00:00',NULL),
('SHP015','ORD018','VND014','BLD424344454','pending','300 Peach Rd, Denver, CO 80201',NULL,'2024-01-25 18:00:00',NULL),
('SHP016','ORD004','VND017','JNT464748495','pending','321 Elm St, Houston, TX 77001',NULL,'2024-01-26 18:00:00',NULL),
('SHP017','ORD005','VND018','NJV505152535','pending','555 Maple Dr, Phoenix, AZ 85001',NULL,'2024-01-27 18:00:00',NULL),
('SHP018','ORD009','VND015','DTC545556575','pending','222 Walnut St, Dallas, TX 75201',NULL,'2024-01-27 18:00:00',NULL),
('SHP019','ORD016','VND019','GLS585960616','pending','100 Palm St, Indianapolis, IN 46201',NULL,'2024-01-28 18:00:00',NULL),
('SHP020','ORD020','VND020','RML626364656','pending','333 Ash Ave, San Jose, CA 95101',NULL,'2024-01-29 18:00:00',NULL)
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 8. SHOP CATEGORIES
-- ====================
INSERT INTO shop_categories (id, name, slug, icon, sort_order) VALUES
('jeans','Jeans','jeans','Shirt',1),
('leather-bags','Leather Bags','leather-bags','ShoppingBag',2),
('skincare','Skin Care','skincare','Droplets',3),
('haircare','Hair Care','haircare','Scissors',4),
('cosmetics','Cosmetics','cosmetics','Palette',5),
('jewelry','Jewelry','jewelry','Gem',6),
('undergarments','Undergarments','undergarments','Heart',7)
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 9. SHOP SUBCATEGORIES
-- ====================
INSERT INTO shop_subcategories (id, category_id, name, slug, sort_order) VALUES
('jeans-men','jeans','Men''s Jeans','mens-jeans',1),
('jeans-women','jeans','Women''s Jeans','womens-jeans',2),
('bags-tote','leather-bags','Tote Bags','tote-bags',1),
('bags-crossbody','leather-bags','Crossbody Bags','crossbody-bags',2),
('bags-clutch','leather-bags','Clutches','clutches',3),
('bags-backpack','leather-bags','Backpacks','backpacks',4),
('skin-moisturizer','skincare','Moisturizers','moisturizers',1),
('skin-serum','skincare','Serums','serums',2),
('skin-cleanser','skincare','Cleansers','cleansers',3),
('skin-sunscreen','skincare','Sunscreens','sunscreens',4),
('hair-shampoo','haircare','Shampoo','shampoo',1),
('hair-conditioner','haircare','Conditioner','conditioner',2),
('hair-treatment','haircare','Treatments','treatments',3),
('cos-face','cosmetics','Face','face',1),
('cos-lips','cosmetics','Lips','lips',2),
('cos-eyes','cosmetics','Eyes','eyes',3),
('jew-rings','jewelry','Rings','rings',1),
('jew-necklaces','jewelry','Necklaces','necklaces',2),
('jew-earrings','jewelry','Earrings','earrings',3),
('jew-bracelets','jewelry','Bracelets','bracelets',4),
('ug-bras','undergarments','Bras','bras',1),
('ug-panties','undergarments','Panties','panties',2),
('ug-boxers','undergarments','Boxers','boxers',3),
('ug-shapewear','undergarments','Shapewear','shapewear',4)
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 10. SHOP PRODUCTS
-- ====================
-- Jeans - Men
INSERT INTO shop_products (id, name, description, price, category, subcategory, sizes, colors, images, in_stock, rating, reviews, metadata) VALUES
('J001','Classic Indigo Slim','Timeless slim-fit jeans in classic indigo wash',89.99,'jeans','mens-jeans','{"28","30","32","34","36"}','{"Dark Indigo"}','{ "/images/products/mens-slim-dark.jpg" }',true,4.5,127,'{"fit":"Slim","wash":"Dark Indigo","gender":"Men"}'),
('J002','Urban Skinny Fit','Modern skinny jeans for urban style',79.99,'jeans','mens-jeans','{"28","30","32","34"}','{"Black"}','{ "/images/products/mens-skinny-black.jpg" }',true,4.3,89,'{"fit":"Skinny","wash":"Black","gender":"Men"}'),
('J003','Comfort Relaxed','Relaxed fit for all-day comfort',74.99,'jeans','mens-jeans','{"30","32","34","36","38"}','{"Stone Wash"}','{ "/images/products/mens-relaxed-light.jpg" }',true,4.6,156,'{"fit":"Relaxed","wash":"Stone Wash","gender":"Men"}'),
('J004','Premium Slim Dark','Premium quality raw denim slim jeans',129.99,'jeans','mens-jeans','{"30","32","34"}','{"Raw Denim"}','{ "/images/products/mens-slim-navy.jpg" }',true,4.8,203,'{"fit":"Slim","wash":"Raw Denim","gender":"Men"}'),
('J005','Distressed Slim','Trendy distressed slim fit',94.99,'jeans','mens-jeans','{"28","30","32","34"}','{"Ripped Blue"}','{ "/images/products/mens-slim-ripped.jpg" }',true,4.4,78,'{"fit":"Slim","wash":"Ripped Blue","gender":"Men"}'),
('J006','Vintage Relaxed','Vintage wash relaxed fit',79.99,'jeans','mens-jeans','{"32","34","36","38"}','{"Vintage Wash"}','{ "/images/products/mens-relaxed-vintage.jpg" }',true,4.5,112,'{"fit":"Relaxed","wash":"Light Wash","gender":"Men"}')
ON CONFLICT (id) DO NOTHING;

-- Jeans - Women
INSERT INTO shop_products (id, name, description, price, category, subcategory, sizes, colors, images, in_stock, rating, reviews, metadata) VALUES
('J007','High Rise Skinny','Flattering high rise skinny jeans',89.99,'jeans','womens-jeans','{"24","26","28","30","32"}','{"Dark Indigo"}','{ "/images/products/womens-skinny-dark.jpg" }',true,4.7,234,'{"fit":"Skinny","wash":"Dark Indigo","gender":"Women"}'),
('J008','Mom Fit Relaxed','Classic mom jeans with relaxed fit',79.99,'jeans','womens-jeans','{"24","26","28","30"}','{"Light Wash"}','{ "/images/products/womens-relaxed-light.jpg" }',true,4.4,98,'{"fit":"Relaxed","wash":"Light Wash","gender":"Women"}'),
('J009','Ankle Slim','Chic ankle-length slim jeans',84.99,'jeans','womens-jeans','{"24","26","28","30"}','{"Medium Blue"}','{ "/images/products/womens-slim-blue.jpg" }',true,4.6,167,'{"fit":"Slim","wash":"Medium Blue","gender":"Women"}'),
('J010','Curve Skinny','Designed for curves skinny fit',94.99,'jeans','womens-jeans','{"26","28","30","32"}','{"Black"}','{ "/images/products/womens-skinny-black.jpg" }',true,4.5,145,'{"fit":"Skinny","wash":"Black","gender":"Women"}'),
('J011','Wide Leg Relaxed','Trendy wide leg relaxed jeans',99.99,'jeans','womens-jeans','{"24","26","28","30"}','{"Stone Wash"}','{ "/images/products/womens-relaxed-wide.jpg" }',true,4.3,89,'{"fit":"Relaxed","wash":"Stone Wash","gender":"Women"}'),
('J012','Bootcut Slim','Classic bootcut slim jeans',89.99,'jeans','womens-jeans','{"26","28","30","32"}','{"Dark Wash"}','{ "/images/products/womens-slim-bootcut.jpg" }',true,4.5,134,'{"fit":"Slim","wash":"Dark Wash","gender":"Women"}'),
('J013','Boyfriend Relaxed','Oversized boyfriend jeans',84.99,'jeans','womens-jeans','{"24","26","28","30"}','{"Medium Wash"}','{ "/images/products/womens-relaxed-boyfriend.jpg" }',true,4.4,112,'{"fit":"Relaxed","wash":"Medium Wash","gender":"Women"}'),
('J014','Flare Leg','Retro flare leg jeans',89.99,'jeans','womens-jeans','{"26","28","30"}','{"Medium Wash"}','{ "/images/products/womens-flare-medium.jpg" }',true,4.6,156,'{"fit":"Flare","wash":"Medium Wash","gender":"Women"}')
ON CONFLICT (id) DO NOTHING;

-- Leather Bags
INSERT INTO shop_products (id, name, description, price, category, subcategory, sizes, colors, images, in_stock, rating, reviews, metadata) VALUES
('LB001','Milano Tote','Hand-crafted Italian leather tote bag with gold-tone hardware',299.99,'leather-bags','tote-bags','{"One Size"}','{"Cognac","Black","Burgundy"}','{ "/images/products/leather-bags-milano-tote.jpg" }',true,4.8,89,'{"material":"Full-grain Italian leather","has_certificate":true,"weight":"0.9kg","dimensions":"38x30x14 cm"}'),
('LB002','Urban Crossbody','Compact pebbled leather crossbody with adjustable strap',189.99,'leather-bags','crossbody-bags','{"One Size"}','{"Black","Tan","Navy"}','{ "/images/products/leather-bags-urban-crossbody.jpg" }',true,4.6,134,'{"material":"Pebbled leather","has_certificate":false,"weight":"0.5kg","dimensions":"24x18x8 cm"}'),
('LB003','Evening Clutch','Elegant saffiano leather clutch for formal occasions',149.99,'leather-bags','clutches','{"One Size"}','{"Gold","Silver","Black"}','{ "/images/products/leather-bags-evening-clutch.jpg" }',true,4.7,67,'{"material":"Saffiano leather","has_certificate":true,"weight":"0.3kg","dimensions":"28x15x5 cm"}'),
('LB004','Heritage Backpack','Vegetable-tanned leather backpack with laptop compartment',349.99,'leather-bags','backpacks','{"One Size"}','{"Brown","Black"}','{ "/images/products/leather-bags-heritage-backpack.jpg" }',true,4.9,45,'{"material":"Vegetable-tanned leather","has_certificate":true,"weight":"1.2kg","dimensions":"42x30x15 cm"}')
ON CONFLICT (id) DO NOTHING;

-- Skincare
INSERT INTO shop_products (id, name, description, price, category, subcategory, sizes, colors, images, in_stock, rating, reviews, metadata) VALUES
('SK001','Hydra-Boost Moisturizer','Deep hydration with hyaluronic acid complex',45.99,'skincare','moisturizers','{"50ml","100ml"}','{}','{ "/images/products/skincare-hydra-moisturizer.jpg" }',true,4.7,312,'{"skin_type":"All","concern":["Dryness","Anti-aging"],"ingredients":["Hyaluronic Acid","Ceramides","Vitamin E","Aloe Vera"],"expiry_date":"2027-06-15"}'),
('SK002','Vitamin C Brightening Serum','Potent 20% vitamin C serum for radiant skin',52.99,'skincare','serums','{"30ml","50ml"}','{}','{ "/images/products/skincare-vitamin-c-serum.jpg" }',true,4.8,278,'{"skin_type":"All","concern":["Dark spots","Dullness"],"ingredients":["Vitamin C 20%","Ferulic Acid","Vitamin E","Niacinamide"],"expiry_date":"2027-03-20"}'),
('SK003','Gentle Foam Cleanser','pH-balanced gentle cleanser for sensitive skin',28.99,'skincare','cleansers','{"150ml","250ml"}','{}','{ "/images/products/skincare-foam-cleanser.jpg" }',true,4.5,189,'{"skin_type":"Sensitive","concern":["Sensitivity","Redness"],"ingredients":["Centella Asiatica","Green Tea","Chamomile","Glycerin"],"expiry_date":"2027-09-10"}'),
('SK004','SPF 50+ UV Shield','Broad-spectrum lightweight sunscreen',34.99,'skincare','sunscreens','{"50ml","75ml"}','{}','{ "/images/products/skincare-spf50-shield.jpg" }',true,4.6,234,'{"skin_type":"All","concern":["Sun protection"],"ingredients":["Zinc Oxide","Titanium Dioxide","Vitamin E","Niacinamide"],"expiry_date":"2027-12-01"}'),
('SK005','Retinol Night Cream','Advanced retinol complex for overnight renewal',62.99,'skincare','moisturizers','{"50ml"}','{}','{ "/images/products/skincare-retinol-night-cream.jpg" }',true,4.9,156,'{"skin_type":"Mature","concern":["Anti-aging","Wrinkles","Fine lines"],"ingredients":["Retinol 0.5%","Peptides","Squalane","Shea Butter"],"expiry_date":"2027-04-30"}')
ON CONFLICT (id) DO NOTHING;

-- Haircare
INSERT INTO shop_products (id, name, description, price, category, subcategory, sizes, colors, images, in_stock, rating, reviews, metadata) VALUES
('HC001','Argan Oil Shampoo','Nourishing shampoo with pure argan oil',24.99,'haircare','shampoo','{"250ml","500ml"}','{}','{ "/images/products/haircare-argan-shampoo.jpg" }',true,4.5,198,'{"hair_type":"All","scent":"Fresh Citrus","concern":["Damage repair","Frizz"],"ingredients":["Argan Oil","Keratin","Biotin","Coconut Oil"]}'),
('HC002','Silk Protein Conditioner','Deep conditioning with silk protein complex',26.99,'haircare','conditioner','{"250ml","500ml"}','{}','{ "/images/products/haircare-silk-conditioner.jpg" }',true,4.6,167,'{"hair_type":"Dry","scent":"Lavender","concern":["Smoothing","Hydration"],"ingredients":["Silk Protein","Avocado Oil","Jojoba Oil","Shea Butter"]}'),
('HC003','Keratin Repair Mask','Intensive keratin treatment for damaged hair',38.99,'haircare','treatments','{"200ml"}','{}','{ "/images/products/haircare-keratin-mask.jpg" }',true,4.8,89,'{"hair_type":"Damaged","scent":"Vanilla Rose","concern":["Damage repair","Strengthening"],"ingredients":["Keratin Complex","Collagen","Argan Oil","Vitamin E"]}'),
('HC004','Moroccan Oil Treatment','Lightweight finishing oil for shine and frizz control',42.99,'haircare','treatments','{"50ml","100ml"}','{}','{ "/images/products/haircare-moroccan-oil.jpg" }',true,4.7,234,'{"hair_type":"All","scent":"Coconut","concern":["Shine","Frizz control"],"ingredients":["Moroccan Argan Oil","Linseed Extract","Vitamin F","Vitamin A"]}')
ON CONFLICT (id) DO NOTHING;

-- Cosmetics
INSERT INTO shop_products (id, name, description, price, category, subcategory, sizes, colors, images, in_stock, rating, reviews, metadata) VALUES
('COS001','Flawless Matte Foundation','Full coverage matte foundation with SPF 15',38.99,'cosmetics','face','{"30ml"}','{"Porcelain","Ivory","Sand","Caramel","Espresso"}','{ "/images/products/cosmetics-flawless-foundation.jpg" }',true,4.6,245,'{"finish":"Matte","waterproof":false,"expiry_date":"2027-08-15","ingredients":["Silica","Dimethicone","Iron Oxides","Titanium Dioxide"]}'),
('COS002','Velvet Matte Lipstick','Long-lasting velvet matte finish lipstick',22.99,'cosmetics','lips','{"3.5g"}','{"Ruby Red","Nude Rose","Berry Plum","Coral Sunset","Mauve Pink"}','{ "/images/products/cosmetics-velvet-lipstick.jpg" }',true,4.7,312,'{"finish":"Matte","waterproof":true,"expiry_date":"2027-10-20","ingredients":["Vitamin E","Jojoba Oil","Beeswax","Carnauba Wax"]}'),
('COS003','Smoky Eye Palette','12-shade smoky eye palette with shimmer and matte finishes',42.99,'cosmetics','eyes','{"12g"}','{}','{ "/images/products/cosmetics-eyeshadow-palette.jpg" }',true,4.8,189,'{"finish":"Shimmer & Matte","waterproof":false,"expiry_date":"2028-01-15","ingredients":["Mica","Talc","Dimethicone","Caprylic Triglyceride"]}'),
('COS004','Volume Max Mascara','Volumizing and lengthening waterproof mascara',18.99,'cosmetics','eyes','{"10ml"}','{"Black","Brown"}','{ "/images/products/cosmetics-volume-mascara.jpg" }',true,4.5,278,'{"finish":"Volumizing","waterproof":true,"expiry_date":"2027-06-30","ingredients":["Beeswax","Carnauba Wax","Panthenol","Keratin"]}')
ON CONFLICT (id) DO NOTHING;

-- Jewelry
INSERT INTO shop_products (id, name, description, price, category, subcategory, sizes, colors, images, in_stock, rating, reviews, metadata) VALUES
('JW001','Solitaire Diamond Ring','Classic solitaire diamond engagement ring in 18K gold',2499.99,'jewelry','rings','{"5","6","7","8","9"}','{"Yellow Gold","White Gold","Rose Gold"}','{ "/images/products/jewelry-diamond-ring.jpg" }',true,4.9,67,'{"metal":"18K Gold","metal_purity":"750","gemstone":"Diamond","has_certificate":true,"carat":"1.0","clarity":"VS1","certificate_url":"/certificates/JW001.pdf"}'),
('JW002','Pearl Strand Necklace','Elegant freshwater pearl necklace with sterling silver clasp',599.99,'jewelry','necklaces','{"16 inch","18 inch","20 inch"}','{"White","Cream"}','{ "/images/products/jewelry-pearl-necklace.jpg" }',true,4.7,89,'{"metal":"Sterling Silver","metal_purity":"925","gemstone":"Freshwater Pearl","has_certificate":true,"certificate_url":"/certificates/JW002.pdf"}'),
('JW003','Sapphire Drop Earrings','Blue sapphire drop earrings in 14K white gold',899.99,'jewelry','earrings','{"One Size"}','{"Blue"}','{ "/images/products/jewelry-sapphire-earrings.jpg" }',true,4.8,45,'{"metal":"14K Gold","metal_purity":"585","gemstone":"Blue Sapphire","has_certificate":true,"carat":"2.0","certificate_url":"/certificates/JW003.pdf"}'),
('JW004','Tennis Bracelet','Classic diamond tennis bracelet in platinum',3299.99,'jewelry','bracelets','{"6.5 inch","7 inch","7.5 inch"}','{"Platinum"}','{ "/images/products/jewelry-tennis-bracelet.jpg" }',true,4.9,34,'{"metal":"Platinum","metal_purity":"950","gemstone":"Diamond","has_certificate":true,"total_carat":"5.0","clarity":"VS2","certificate_url":"/certificates/JW004.pdf"}')
ON CONFLICT (id) DO NOTHING;

-- Undergarments
INSERT INTO shop_products (id, name, description, price, category, subcategory, sizes, colors, images, in_stock, rating, reviews, metadata) VALUES
('UG001','Everyday Comfort Bra','Wire-free comfort bra with breathable cotton blend',29.99,'undergarments','bras','{"32A","32B","34A","34B","34C","36B","36C","38C"}','{"White","Black","Nude","Blush"}','{ "/images/products/undergarments-everyday-bra.jpg" }',true,4.5,198,'{"material":"Cotton blend","non_returnable":true,"privacy_packaging":true}'),
('UG002','Lace Bikini Panties','Delicate lace bikini panties set (3-pack)',24.99,'undergarments','panties','{"XS","S","M","L","XL"}','{"Blush","Black","White"}','{ "/images/products/undergarments-lace-bikini.jpg" }',true,4.4,156,'{"material":"Lace & Cotton","non_returnable":true,"privacy_packaging":true}'),
('UG003','Premium Cotton Boxers','Premium cotton boxer briefs set (3-pack)',34.99,'undergarments','boxers','{"S","M","L","XL","XXL"}','{"Navy","Black","Grey"}','{ "/images/products/undergarments-premium-boxers.jpg" }',true,4.6,234,'{"material":"100% Cotton","non_returnable":true,"privacy_packaging":true}'),
('UG004','Sculpting Shapewear','High-waist sculpting bodysuit for smooth silhouette',49.99,'undergarments','shapewear','{"S","M","L","XL"}','{"Nude","Black"}','{ "/images/products/undergarments-sculpting-shapewear.jpg" }',true,4.7,89,'{"material":"Nylon Spandex","non_returnable":true,"privacy_packaging":true}')
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 11. COUPONS
-- ====================
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, used_count, is_active, valid_from, valid_until) VALUES
('cpn-001','WELCOME10','10% off for new customers','PERCENTAGE',10.00,50.00,100.00,500,42,true,'2025-01-01 00:00:00','2026-12-31 23:59:59'),
('cpn-002','SUMMER25','Summer sale – 25% off orders over $100','PERCENTAGE',25.00,100.00,200.00,200,87,true,'2025-06-01 00:00:00','2025-08-31 23:59:59'),
('cpn-003','FLAT50','$50 flat discount on orders over $250','FIXED',50.00,250.00,NULL,100,15,true,'2025-03-01 00:00:00','2026-03-01 23:59:59'),
('cpn-004','EXPIRED20','Expired promo – 20% off','PERCENTAGE',20.00,0,NULL,100,100,false,'2024-01-01 00:00:00','2024-12-31 23:59:59'),
('cpn-005','VIP15','VIP customers – 15% off everything','PERCENTAGE',15.00,0,NULL,NULL,NULL,true,'2025-01-01 00:00:00','2026-12-31 23:59:59')
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 12. CASH FLOW TRANSACTIONS
-- ====================
INSERT INTO cash_flow_transactions (id, type, category, amount, description, reference_type, payment_method, status, transaction_date) VALUES
('cf-001','INCOME','Sales',15400.00,'January product sales revenue','ORDER','Card','COMPLETED','2025-01-31 00:00:00'),
('cf-002','EXPENSE','Inventory Purchase',8200.00,'Bulk denim fabric purchase – Q1',NULL,'Bank Transfer','COMPLETED','2025-01-15 00:00:00'),
('cf-003','EXPENSE','Shipping',1250.00,'January shipping costs via Pathao and Steadfast',NULL,'Cash','COMPLETED','2025-01-31 00:00:00'),
('cf-004','INCOME','Sales',22800.00,'February product sales revenue','ORDER','Card','COMPLETED','2025-02-28 00:00:00'),
('cf-005','EXPENSE','Salary',5000.00,'Staff salaries – February',NULL,'Bank Transfer','COMPLETED','2025-02-28 00:00:00'),
('cf-006','EXPENSE','Rent',3000.00,'Warehouse rent – March',NULL,'Bank Transfer','COMPLETED','2025-03-01 00:00:00'),
('cf-007','INCOME','Refund Received',450.00,'Supplier refund for damaged goods',NULL,'Bank Transfer','COMPLETED','2025-03-05 00:00:00'),
('cf-008','EXPENSE','Marketing',1800.00,'Facebook & Instagram ads – March',NULL,'Card','PENDING','2025-03-10 00:00:00')
ON CONFLICT (id) DO NOTHING;

-- ====================
-- 13. PRODUCT RETURNS
-- ====================
INSERT INTO product_returns (id, order_id, product_id, product_name, customer_name, customer_email, quantity, reason, description, status, refund_amount, refund_status, restock, notes, requested_at, resolved_at) VALUES
('ret-001','ORD001','P001','Classic Indigo Slim','John Smith','john@example.com',1,'DEFECTIVE','Stitching came loose after first wash','APPROVED',89.99,'PROCESSED',false,NULL,'2025-02-15 10:30:00','2025-02-18 14:00:00'),
('ret-002','ORD002','P009','High Rise Skinny','Jane Doe','jane@example.com',1,'WRONG_SIZE','Ordered size 26 but need size 28','PENDING',89.99,'NONE',true,NULL,'2025-03-01 09:15:00',NULL),
('ret-003','ORD003','P004','Premium Slim Dark','Bob Wilson','bob@example.com',1,'NOT_AS_DESCRIBED','Color differs from website photo','REJECTED',NULL,'NONE',false,'Product matches listing. Return denied.','2025-02-20 16:45:00','2025-02-22 11:00:00'),
('ret-004','ORD004','P012','Curve Skinny','Alice Brown','alice@example.com',2,'CHANGED_MIND','Found a better deal elsewhere','APPROVED',189.98,'PENDING',true,NULL,'2025-03-02 08:00:00',NULL),
('ret-005','ORD005','P007','Executive Slim','David Lee','david@example.com',1,'DAMAGED_IN_SHIPPING','Package arrived torn and product stained','RECEIVED',99.99,'NONE',false,NULL,'2025-03-04 12:30:00',NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Done – all demo data inserted.
-- ============================================================
