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
