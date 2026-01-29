

# Janes Jeans Admin Dashboard

## Overview
A professional admin dashboard for managing a jeans e-commerce business with dynamic gender filtering, comprehensive analytics, inventory management, and full order management capabilities.

---

## Core Features

### 1. Gender Toggle System
- **Primary toggle at the top of the dashboard** with three options: Men | Women | All
- **Dynamic filtering** that instantly updates all dashboard components:
  - Sales statistics and revenue
  - Charts and visualizations
  - Inventory table data
  - Order summaries

### 2. Dashboard Stats Cards
- **Total Sales** - Revenue with currency formatting
- **Active Orders** - Count of pending/processing orders
- **Low Stock Alerts** - Products with stock below 10 units
- **Total Customers** - Unique customer count

### 3. Analytics Charts (Recharts)
- **Sales Analytics Bar Chart** - Monthly/weekly sales trends
- **Category Distribution Pie Chart** - Sales breakdown by fit type (Slim, Skinny, Relaxed)

### 4. Inventory Management Table
- **Columns**: Product Name, Gender, Fit, Size, Wash, Price, Stock Level
- **Low Stock Badge** (red) for items under 10 units
- **Horizontally scrollable** on mobile devices
- **Filtering** synced with gender toggle

### 5. Order Management (Full CRUD)
- **Order listing** with status tracking
- **Status options**: Pending → Processing → Shipped → Delivered
- **Actions**: Create new orders, update status, view details, delete orders
- **Order details**: Customer info, items, shipping, timestamps

### 6. Bilingual Support (English/Bengali)
- **Language toggle switch** in the header
- **Key labels translated**: Navigation, stats, table headers, buttons
- **Persistent preference** saved in browser

---

## Design & Layout

### Navigation
- **Collapsible sidebar** with icons and labels
- **Sections**: Dashboard, Inventory, Orders, Analytics
- **Mobile-responsive**: Collapses to icon-only on small screens

### Theme: Denim Professional
- **Primary**: Deep Indigo (#1e3a5f)
- **Secondary**: Slate Gray (#1e293b)
- **Accents**: Clean whites, subtle blue highlights
- **Typography**: Modern, clean sans-serif fonts

---

## Mock Data Structure

### ProductDTO Pattern
```
- id, name, gender (Men/Women)
- fit (Slim/Skinny/Relaxed)
- size, wash, price, stockLevel
```

### OrderDTO Pattern
```
- id, customerName, items[], status
- orderDate, shippedDate, totalAmount
```

### Simulated API Endpoints
- `GET /api/products?gender={category}`
- `GET/POST/PUT/DELETE /api/orders`

---

## Pages to Build

1. **Dashboard** - Overview with stats, charts, and quick insights
2. **Inventory** - Full product table with low stock highlighting
3. **Orders** - Order management with status workflow
4. **Settings** - Language toggle and preferences

