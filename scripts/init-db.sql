-- Jane's Jeans Database Initialization Script
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_type AS ENUM ('CARD', 'BKASH', 'CASH_ON_DELIVERY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_category AS ENUM ('TSHIRTS', 'HOODIES', 'JEANS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_action AS ENUM ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create initial super admin user (password: admin123)
-- Note: In production, change this password immediately!
INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'admin@janesjeans.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi',
    'Super',
    'Admin',
    'SUPER_ADMIN',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, description, price, category, sizes, colors, image_url, in_stock, rating, reviews)
VALUES 
    (uuid_generate_v4(), 'Classic Cotton T-Shirt', 'Premium quality cotton t-shirt with a comfortable fit', 29.99, 'TSHIRTS', 'S,M,L,XL', 'White,Black,Navy,Gray', '/images/tshirt-classic.jpg', true, 4.5, 128),
    (uuid_generate_v4(), 'Vintage Hoodie', 'Cozy vintage-style hoodie perfect for casual wear', 59.99, 'HOODIES', 'S,M,L,XL,XXL', 'Charcoal,Burgundy,Forest Green', '/images/hoodie-vintage.jpg', true, 4.7, 89),
    (uuid_generate_v4(), 'Slim Fit Jeans', 'Modern slim fit jeans with stretch comfort', 79.99, 'JEANS', '28,30,32,34,36', 'Indigo,Black,Light Wash', '/images/jeans-slim.jpg', true, 4.6, 256)
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully!';
END $$;
