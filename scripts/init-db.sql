-- Jane's Jeans MySQL Database Initialization Script
-- This script runs automatically when the MySQL container starts for the first time

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS janesjeans CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE janesjeans;

-- Grant permissions
GRANT ALL PRIVILEGES ON janesjeans.* TO 'root'@'%';
FLUSH PRIVILEGES;

-- Log initialization
SELECT 'Database initialization completed successfully!' AS status;

-- --------------------------------------------------
-- Create categories table and product_categories join
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
	id CHAR(36) NOT NULL PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE,
	description TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_categories (
	product_id CHAR(36) NOT NULL,
	category_id CHAR(36) NOT NULL,
	PRIMARY KEY (product_id, category_id),
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
	FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert categories (10)
INSERT IGNORE INTO categories (id, name, description) VALUES
	(UUID(), 'jeans', 'Denim jeans and bottoms'),
	(UUID(), 'shirts', 'Casual and formal shirts'),
	(UUID(), 't-shirts', 'Graphic and plain t-shirts'),
	(UUID(), 'jackets', 'Outerwear and jackets'),
	(UUID(), 'shorts', 'Casual and sport shorts'),
	(UUID(), 'sweaters', 'Knitwear and sweaters'),
	(UUID(), 'dresses', 'Women dresses and rompers'),
	(UUID(), 'skirts', 'Skirts and mid-length bottoms'),
	(UUID(), 'shoes', 'Casual and formal shoes'),
	(UUID(), 'accessories', 'Belts, hats, bags, and accessories');

