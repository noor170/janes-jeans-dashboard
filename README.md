# 👖 Jane's Jeans - E-Commerce Platform

<div align="center">

![Jane's Jeans Logo](https://img.shields.io/badge/Jane's%20Jeans-E--Commerce-blue?style=for-the-badge&logo=shopify&logoColor=white)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat-square&logo=spring)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**A modern, full-stack e-commerce platform for clothing retail with guest checkout support.**

[Live Demo](https://denim-dash-toggle.lovable.app) · [Report Bug](https://github.com/your-repo/issues) · [Request Feature](https://github.com/your-repo/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Option 1: Manual Localhost Deployment](#-option-1-manual-localhost-deployment)
  - [Step 1: MySQL Setup](#step-1-mysql-database-setup-port-3306)
  - [Step 2: Backend Setup](#step-2-spring-boot-backend-port-8080)
  - [Step 3: Frontend Setup](#step-3-react-frontend-port-5173)
- [Option 2: Docker Deployment (One Command)](#-option-2-docker-deployment-one-command)
- [Option 3: Production Nginx Deployment](#-option-3-production-nginx-server-deployment)
- [Environment Variables](#-environment-variables)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**Jane's Jeans** is a comprehensive e-commerce platform designed for clothing retail businesses. It features a modern React frontend with a clean, responsive UI and a robust Spring Boot backend API. The platform supports both authenticated admin operations and guest checkout for customers.

### Key Highlights

- 🛒 **Guest Checkout Flow** - Customers can browse and purchase without creating an account
- 👔 **Product Catalog** - Dynamic product listings with filtering, search, and image zoom
- 📊 **Admin Dashboard** - Comprehensive analytics and user management
- 🔐 **JWT Authentication** - Secure admin access with role-based permissions
- 📧 **Email Notifications** - Automated order confirmation emails
- 🎨 **Modern UI/UX** - Beautiful, responsive design with dark mode support

---

## ✨ Features

### Customer Features

| Feature | Description |
|---------|-------------|
| 🏪 **Shopping Dashboard** | Browse clothing items with category and price filters |
| 📦 **Product Details** | View high-quality images with hover-to-zoom and lightbox |
| 🛒 **Shopping Cart** | Add, remove, and manage items with real-time price updates |
| 📝 **Checkout Flow** | Multi-step checkout with shipment details collection |
| 💳 **Payment Options** | Support for Card and bKash payment methods |
| ✅ **Order Confirmation** | Success page with order summary and email confirmation |
| 📦 **Stock Validation** | Real-time inventory check before and during checkout |

### Admin Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard Analytics** | User statistics, growth charts, and activity feeds |
| 👥 **User Management** | Create, edit, deactivate, and manage admin users |
| 📋 **Order Management** | View and process customer orders (Pending → Shipped → Delivered) |
| 📦 **Inventory Control** | Manage product stock and details |
| 🚚 **Shipment Tracking** | Track and manage shipments |
| 📈 **Audit Logs** | Complete activity logging for compliance |
| 🌐 **Multi-language** | Support for English and Bengali |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://reactjs.org/) | 18.3.x | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type Safety |
| [Vite](https://vitejs.dev/) | 5.x | Build Tool |
| [Tailwind CSS](https://tailwindcss.com/) | 3.x | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | Latest | Component Library |
| [React Router](https://reactrouter.com/) | 6.x | Routing |
| [TanStack Query](https://tanstack.com/query) | 5.x | Data Fetching |
| [Recharts](https://recharts.org/) | 2.x | Charts & Analytics |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| [Java](https://openjdk.org/) | 17 | Programming Language |
| [Spring Boot](https://spring.io/projects/spring-boot) | 3.2.x | Framework |
| [Spring Security](https://spring.io/projects/spring-security) | 6.x | Authentication & Authorization |
| [Spring Data JPA](https://spring.io/projects/spring-data-jpa) | 3.x | Database Access (Hibernate) |
| [MySQL](https://www.mysql.com/) | 8.0 | Relational Database |
| [Liquibase](https://www.liquibase.org/) | Latest | Database Migration & Seeding |
| [JWT (jjwt)](https://github.com/jwtk/jjwt) | 0.11.x | Token Authentication |
| [Spring Mail](https://spring.io/guides/gs/sending-email/) | 3.x | Email Service |
| [Lombok](https://projectlombok.org/) | Latest | Boilerplate Reduction |

### DevOps & Tools

| Technology | Purpose |
|------------|---------|
| [Docker](https://www.docker.com/) | Containerization |
| [Docker Compose](https://docs.docker.com/compose/) | Multi-container Orchestration |
| [Nginx](https://nginx.org/) | Web Server / Reverse Proxy |
| [phpMyAdmin](https://www.phpmyadmin.net/) | Database Management UI |

---

## 📁 Project Structure

```
janes-jeans/
├── 📂 backend/                    # Spring Boot Backend
│   ├── 📂 src/main/java/com/janesjeans/api/
│   │   ├── 📂 config/            # Security, CORS, JWT filter
│   │   ├── 📂 controller/        # REST API controllers
│   │   ├── 📂 dto/               # Data Transfer Objects
│   │   ├── 📂 entity/            # JPA Entities (User, Product, Order...)
│   │   ├── 📂 repository/        # Spring Data JPA repositories
│   │   ├── 📂 service/           # Business logic + EmailService
│   │   └── JanesJeansApplication.java
│   ├── 📂 src/main/resources/
│   │   ├── 📂 db/changelog/      # Liquibase migrations & seed data
│   │   └── application.yml       # App configuration
│   ├── 📂 target/
│   │   └── janes-jeans-api-1.0.0.jar  # Compiled JAR file
│   ├── Dockerfile
│   └── pom.xml
│
├── 📂 src/                        # React Frontend
│   ├── 📂 components/            # UI components (admin, shop, ui)
│   ├── 📂 contexts/              # Auth, Cart, Language, Notification
│   ├── 📂 pages/                 # Page components (shop + admin)
│   ├── 📂 lib/                   # API clients & utilities
│   ├── 📂 types/                 # TypeScript definitions
│   └── main.tsx                  # Entry point
│
├── 📂 public/images/products/     # Product images
├── 📂 scripts/init-db.sql        # Manual DB init script
├── Dockerfile                     # Frontend Docker build
├── docker-compose.yml             # Full-stack Docker orchestration
├── nginx.conf                     # Nginx configuration
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

---

## 📦 Prerequisites

Before starting, make sure you have the following installed:

| Software | Version | Download Link | Check Command |
|----------|---------|--------------|---------------|
| **Java JDK** | 17+ | [Download](https://adoptium.net/) | `java -version` |
| **Maven** | 3.9+ | [Download](https://maven.apache.org/download.cgi) | `mvn -version` |
| **Node.js** | 18+ | [Download](https://nodejs.org/) | `node -v` |
| **npm** | 9+ | Comes with Node.js | `npm -v` |
| **MySQL** | 8.0 | [Download](https://dev.mysql.com/downloads/mysql/) | `mysql --version` |
| **Git** | Any | [Download](https://git-scm.com/) | `git --version` |

> 💡 **Optional**: Install [Docker](https://www.docker.com/products/docker-desktop/) if you prefer the one-command setup (Option 2).

---

## 🖥 Option 1: Manual Localhost Deployment

This is the simplest approach — run everything on your local machine step by step.

### Step 1: MySQL Database Setup (Port 3306)

#### 1.1 Install MySQL

**Windows:**
- Download MySQL Installer from https://dev.mysql.com/downloads/installer/
- Run installer → Choose "MySQL Server 8.0" + "MySQL Workbench" (optional)
- Set root password during installation (remember it!)

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### 1.2 Verify MySQL is Running

```bash
# Check if MySQL is running on port 3306
mysql -u root -p -e "SELECT VERSION();"
```

You should see something like: `8.0.xx`

#### 1.3 Create the Database

```bash
# Login to MySQL
mysql -u root -p

# Inside MySQL prompt, run:
CREATE DATABASE janesjeans CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;  -- Verify 'janesjeans' appears
EXIT;
```

> ✅ **That's it for the database!** Liquibase (built into the backend) will automatically create all tables and seed demo data when you start the backend.

---

### Step 2: Spring Boot Backend (Port 8080)

#### 2.1 Clone the Project

```bash
git clone https://github.com/your-username/janes-jeans.git
cd janes-jeans
```

#### 2.2 Configure Database Connection

Open `backend/src/main/resources/application.yml` and verify the dev profile settings match your MySQL:

```yaml
# The defaults are already set — only change if your MySQL password is different
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/janesjeans?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true
    username: root          # Your MySQL username
    password: 12345678      # Your MySQL password ← CHANGE THIS
```

Or set via environment variables (recommended):

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=janesjeans
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password
```

#### 2.3 Build the JAR File

```bash
cd backend

# Build (this downloads dependencies and compiles the JAR)
mvn clean package -DskipTests

# The JAR file will be at:
# backend/target/janes-jeans-api-1.0.0.jar
```

> ⏱ First build takes 2-5 minutes (downloads dependencies). Subsequent builds are faster.

#### 2.4 Run the Backend

**Option A: Run with Maven (Development)**
```bash
mvn spring-boot:run
```

**Option B: Run the JAR directly (Production-like)**
```bash
java -jar target/janes-jeans-api-1.0.0.jar
```

**Option C: Run with custom environment variables**
```bash
java -jar target/janes-jeans-api-1.0.0.jar \
  --spring.datasource.password=your_mysql_password \
  --jwt.secret=your-super-secret-jwt-key-at-least-32-characters
```

#### 2.5 Verify Backend is Running

```bash
# Health check
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"}

# Test product API
curl http://localhost:8080/api/shop/products
# Expected: JSON array of products
```

> ✅ **Backend is ready!** Liquibase has automatically created tables and seeded demo data (products, users, etc.).

---

### Step 3: React Frontend (Port 5173)

#### 3.1 Install Dependencies

```bash
# Go back to project root
cd ..

# Install Node.js dependencies
npm install
```

#### 3.2 Configure API URL

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
VITE_API_URL=http://localhost:8080
```

#### 3.3 Start the Frontend

```bash
npm run dev
```

#### 3.4 Open in Browser

```
🛒 Shop:     http://localhost:5173/shop
🔐 Admin:    http://localhost:5173/admin-login
📊 Dashboard: http://localhost:5173/dashboard  (after login)
```

### ✅ You're Done! Full Stack Running Locally

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:5173 | 5173 |
| **Backend API** | http://localhost:8080 | 8080 |
| **MySQL** | localhost | 3306 |

---

## 🐳 Option 2: Docker Deployment (One Command)

If you have Docker installed, this is the fastest way:

```bash
# 1. Clone the project
git clone https://github.com/your-username/janes-jeans.git
cd janes-jeans

# 2. Create environment file
cp .env.example .env
# Edit .env with your preferred passwords

# 3. Start everything (MySQL + Backend + Frontend)
docker-compose up -d --build

# 4. Wait ~60 seconds for MySQL + Backend to initialize, then check:
docker-compose ps
```

### Service URLs (Docker)

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React app served by Nginx |
| **Backend API** | http://localhost:8080 | Spring Boot API |
| **MySQL** | localhost:3306 | Database |
| **phpMyAdmin** | http://localhost:5050 | DB management (optional) |

> To enable phpMyAdmin: `docker-compose --profile tools up -d`

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f backend     # Backend logs
docker-compose logs -f frontend    # Frontend logs

# Restart a service
docker-compose restart backend

# Stop everything
docker-compose down

# Stop + delete all data (fresh start)
docker-compose down -v
```

---

## 🌐 Option 3: Production Nginx Server Deployment

This guide shows how to deploy on a Linux server (Ubuntu/Debian) using Nginx as a reverse proxy for the frontend and backend.

### Architecture

```
Internet
   │
   ▼
┌──────────────┐
│   Nginx      │  Port 80/443
│  (Reverse    │
│   Proxy)     │
├──────┬───────┤
│      │       │
│  /   │ /api/ │
│      │       │
▼      ▼       ▼
┌─────┐ ┌──────────┐ ┌───────┐
│React│ │Spring    │ │MySQL  │
│Files│ │Boot JAR  │ │Server │
│     │ │Port 8080 │ │Port   │
│     │ │          │ │3306   │
└─────┘ └──────────┘ └───────┘
```

### Step 1: Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx mysql-server openjdk-17-jre-headless nodejs npm git ufw
```

### Step 2: MySQL Setup on Server

```bash
# Secure MySQL installation
sudo mysql_secure_installation
# → Set root password, remove anonymous users, disable remote root login

# Create database
sudo mysql -u root -p
```

```sql
CREATE DATABASE janesjeans CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'janesjeans'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON janesjeans.* TO 'janesjeans'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Deploy Backend JAR

```bash
# Create app directory
sudo mkdir -p /opt/janesjeans
sudo chown $USER:$USER /opt/janesjeans

# Copy your JAR file to the server
# (from your local machine)
scp backend/target/janes-jeans-api-1.0.0.jar user@your-server:/opt/janesjeans/

# Or build on the server:
cd /opt/janesjeans
git clone https://github.com/your-username/janes-jeans.git .
cd backend
mvn clean package -DskipTests
cp target/janes-jeans-api-1.0.0.jar /opt/janesjeans/app.jar
```

### Step 4: Create Systemd Service for Backend

This makes the backend start automatically on server boot.

```bash
sudo nano /etc/systemd/system/janesjeans.service
```

Paste the following:

```ini
[Unit]
Description=Jane's Jeans Spring Boot Application
After=mysql.service
Requires=mysql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/janesjeans

# ─── IMPORTANT: Update these values ───
Environment=SPRING_PROFILES_ACTIVE=prod
Environment=DB_HOST=localhost
Environment=DB_PORT=3306
Environment=DB_NAME=janesjeans
Environment=DB_USERNAME=janesjeans
Environment=DB_PASSWORD=YourStrongPassword123!
Environment=JWT_SECRET=generate-a-long-random-secret-key-at-least-32-characters-long
Environment=MAIL_HOST=smtp.gmail.com
Environment=MAIL_PORT=587
Environment=MAIL_USERNAME=your-email@gmail.com
Environment=MAIL_PASSWORD=your-app-password
Environment=CORS_ALLOWED_ORIGINS=https://yourdomain.com

ExecStart=/usr/bin/java -Xms256m -Xmx512m -jar /opt/janesjeans/app.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable janesjeans
sudo systemctl start janesjeans

# Check status
sudo systemctl status janesjeans

# View logs
sudo journalctl -u janesjeans -f
```

### Step 5: Build Frontend for Production

```bash
cd /opt/janesjeans

# Install dependencies
npm install

# Create production .env
echo "VITE_API_URL=https://yourdomain.com" > .env

# Build static files
npm run build

# Copy built files to Nginx directory
sudo mkdir -p /var/www/janesjeans
sudo cp -r dist/* /var/www/janesjeans/
sudo chown -R www-data:www-data /var/www/janesjeans
```

### Step 6: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/janesjeans
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    # After setting up SSL with certbot, this block will auto-redirect to HTTPS

    root /var/www/janesjeans;
    index index.html;

    # ─── Gzip Compression ───
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/javascript application/xml application/json;

    # ─── Security Headers ───
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # ─── Cache Static Assets (JS, CSS, Images) ───
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # ─── Proxy API Requests to Spring Boot Backend ───
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }

    # ─── Proxy Actuator Health Check ───
    location /actuator/ {
        proxy_pass http://127.0.0.1:8080/actuator/;
        proxy_set_header Host $host;
        allow 127.0.0.1;
        deny all;
    }

    # ─── React SPA: Send all other routes to index.html ───
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/janesjeans /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default    # Remove default site

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 7: Enable HTTPS with Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (auto-configures Nginx)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically. Test it:
sudo certbot renew --dry-run
```

### Step 8: Configure Firewall

```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
sudo ufw status
```

> ⚠️ **Do NOT expose port 3306 (MySQL) or 8080 (backend) to the internet.** Nginx handles all public traffic on port 80/443 and proxies API requests internally to port 8080.

### ✅ Production Deployment Complete!

| Component | Location | Notes |
|-----------|----------|-------|
| **Frontend** | `/var/www/janesjeans/` | Static files served by Nginx |
| **Backend JAR** | `/opt/janesjeans/app.jar` | Managed by systemd |
| **Backend Service** | `/etc/systemd/system/janesjeans.service` | Auto-starts on boot |
| **Nginx Config** | `/etc/nginx/sites-available/janesjeans` | Reverse proxy |
| **MySQL** | localhost:3306 | Internal only |
| **Logs** | `journalctl -u janesjeans -f` | Backend logs |

---

## 🔧 Environment Variables

### Complete Reference

| Variable | Default | Where Used | Description |
|----------|---------|------------|-------------|
| `DB_HOST` | `localhost` | Backend | MySQL host |
| `DB_PORT` | `3306` | Backend | MySQL port |
| `DB_NAME` | `janesjeans` | Backend | Database name |
| `DB_USERNAME` | `root` | Backend | MySQL username |
| `DB_PASSWORD` | `12345678` | Backend | MySQL password |
| `JWT_SECRET` | (default key) | Backend | JWT signing key (change in prod!) |
| `MAIL_HOST` | `smtp.gmail.com` | Backend | SMTP server |
| `MAIL_PORT` | `587` | Backend | SMTP port |
| `MAIL_USERNAME` | (empty) | Backend | Email sender address |
| `MAIL_PASSWORD` | (empty) | Backend | Email app password |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,...` | Backend | Allowed frontend origins |
| `SPRING_PROFILES_ACTIVE` | `dev` | Backend | Active profile: `dev`, `docker`, `prod` |
| `VITE_API_URL` | `http://localhost:8080` | Frontend | Backend API base URL |

### Gmail SMTP Setup (for order confirmation emails)

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to **App passwords** → Generate one for "Mail"
4. Use the 16-character password as `MAIL_PASSWORD`

---

## 📖 Usage Guide

### Customer Flow

1. Visit `http://yourdomain.com/shop` to browse products
2. Click any product to see details, hover to zoom, click to open lightbox
3. Select size → **Add to Cart**
4. Click cart icon → **Proceed to Checkout**
5. Fill shipping details → Choose payment method → **Place Order**
6. Receive order confirmation email ✉️

### Admin Flow

1. Navigate to `/admin-login`
2. Login with admin credentials
3. Access Dashboard, Orders, Inventory, Users, Audit Logs, Shipments

### Default Admin Credentials

```
Email:    admin@janesjeans.com
Password: admin123
```

⚠️ **Change these immediately in production!**

---

## 📚 API Documentation

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/shop/products` | List all shop products |
| `GET` | `/api/shop/products/{id}` | Get product details |
| `POST` | `/api/shop/check-stock` | Verify stock availability |
| `POST` | `/api/shop/orders` | Place a guest order |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/admin/login` | Admin login |
| `POST` | `/api/auth/register` | Register user |
| `GET` | `/api/auth/validate` | Validate JWT token |

### Protected Admin Endpoints (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products (admin view) |
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/{id}` | Update product |
| `DELETE` | `/api/products/{id}` | Delete product |
| `GET` | `/api/orders` | List all orders |
| `PUT` | `/api/orders/{id}` | Update order |
| `GET` | `/api/customers` | List customers |
| `GET` | `/api/admin/users` | List users |
| `POST` | `/api/admin/users/create-admin` | Create admin |
| `GET` | `/api/audit-logs` | View audit logs |
| `GET` | `/api/shipments` | List shipments |
| `GET` | `/api/vendors` | List shipping vendors |

### Example: Place a Guest Order

```bash
curl -X POST http://localhost:8080/api/shop/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod-001",
        "productName": "Slim Fit Dark Wash",
        "size": "32",
        "quantity": 1,
        "price": 89.99
      }
    ],
    "shipmentDetails": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+880 1700-000000",
      "address": "123 Main Street",
      "city": "Dhaka",
      "postalCode": "1200"
    },
    "payment": {
      "type": "CARD",
      "status": "SUCCESS"
    },
    "totalAmount": 89.99
  }'
```

---

## 🗄 Database Schema

Liquibase automatically manages migrations. Tables are created on first backend startup.

```
┌──────────────────┐       ┌──────────────────┐
│      users       │       │     products     │
├──────────────────┤       ├──────────────────┤
│ id (PK, UUID)    │       │ id (PK, UUID)    │
│ email            │       │ name             │
│ password         │       │ description      │
│ first_name       │       │ price            │
│ last_name        │       │ gender           │
│ role             │       │ fit, size, wash  │
│ is_active        │       │ stock_level      │
│ created_at       │       │ image_url        │
└──────────────────┘       └──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│      orders      │       │   order_items    │
├──────────────────┤       ├──────────────────┤
│ id (PK, UUID)    │       │ id (PK, UUID)    │
│ customer_name    │       │ order_id (FK)    │
│ customer_email   │       │ product_id       │
│ status           │       │ product_name     │
│ total_amount     │       │ size, quantity   │
│ shipping_address │       │ price            │
│ notes            │       └──────────────────┘
│ order_date       │
│ shipped_date     │
│ delivered_date   │
└──────────────────┘

┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│    customers     │    │    shipments     │    │ shipping_vendors │
├──────────────────┤    ├──────────────────┤    ├──────────────────┤
│ id, name, email  │    │ id, order_id     │    │ id, name         │
│ phone, address   │    │ tracking_number  │    │ contact, email   │
│ city, country    │    │ vendor_id, status│    │ phone, website   │
└──────────────────┘    └──────────────────┘    └──────────────────┘

┌──────────────────┐
│    audit_logs    │
├──────────────────┤
│ id, action       │
│ entity_type      │
│ user_email       │
│ details, ip      │
│ created_at       │
└──────────────────┘
```

---

## 🔥 Troubleshooting

### Backend won't start

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Check if port 3306 is in use
sudo lsof -i :3306

# Check backend logs
journalctl -u janesjeans -n 50
# or
java -jar app.jar 2>&1 | tail -50
```

### "Connection refused" to MySQL

```bash
# Verify MySQL is listening on 3306
sudo netstat -tlnp | grep 3306

# Test MySQL connection
mysql -u root -p -h localhost -P 3306 -e "SHOW DATABASES;"
```

### Frontend can't reach Backend API

```bash
# Check if backend is running on 8080
curl http://localhost:8080/actuator/health

# Verify VITE_API_URL in .env matches the backend URL
cat .env | grep VITE_API_URL

# Check CORS settings in application.yml
# Make sure your frontend origin is listed in cors.allowed-origins
```

### Port already in use

```bash
# Find and kill process on port 8080
sudo lsof -i :8080
sudo kill -9 <PID>

# Or change the backend port in application.yml:
# server.port: 8081
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat(cart): add quantity update'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by the Jane's Jeans Team**

[⬆ Back to Top](#-janes-jeans---e-commerce-platform)

</div>
