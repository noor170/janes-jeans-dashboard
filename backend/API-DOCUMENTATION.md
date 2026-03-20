# Jane's Jeans API Documentation

Base URL: `http://localhost:8080`

## Authentication

All protected endpoints require a JWT Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Table of Contents

1. [Authentication](#authentication-1)
2. [Shop (Public)](#shop-public)
3. [Products](#products)
4. [Orders](#orders)
5. [Customers](#customers)
6. [Coupons](#coupons)
7. [Shipments](#shipments)
8. [Shipping Vendors](#shipping-vendors)
9. [Cash Flow](#cash-flow)
10. [Product Returns](#product-returns)
11. [Admin - Users](#admin--users)
12. [Admin - Audit Logs](#admin--audit-logs)

---

## Authentication

**Base Path:** `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/admin/login` | Admin login | No |
| POST | `/api/auth/refresh` | Refresh access token | Yes |
| GET | `/api/auth/validate` | Validate current token | Yes |
| GET | `/api/auth/health` | Health check | No |

### Register a new user

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### User login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Admin login

```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@janesjeans.com",
  "password": "admin123"
}
```

### Refresh token

```http
POST /api/auth/refresh
Authorization: Bearer <refresh-token>
```

---

## Shop (Public)

**Base Path:** `/api/shop`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/shop/categories` | List all shop categories | No |
| GET | `/api/shop/catalog` | Search & browse shop catalog (paginated) | No |
| GET | `/api/shop/catalog/{id}` | Get shop catalog product by ID | No |
| GET | `/api/shop/products` | List shop products (legacy) | No |
| GET | `/api/shop/products/{id}` | Get shop product by ID | No |
| POST | `/api/shop/check-stock` | Check stock availability | No |
| POST | `/api/shop/orders` | Create guest order | No |
| POST | `/api/shop/orders/confirm` | Confirm guest order | No |
| POST | `/api/shop/orders/confirm-with-otp` | Initiate order with OTP | No |

### Catalog Search Parameters

```
GET /api/shop/catalog?category=jeans&subcategory=skinny&search=blue&inStock=true&minPrice=50&maxPrice=200&page=0&size=12&sortBy=price&sortDir=asc
```

| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category slug |
| subcategory | string | Filter by subcategory slug |
| search | string | Search by name or description |
| inStock | boolean | Filter by stock availability |
| minPrice | decimal | Minimum price |
| maxPrice | decimal | Maximum price |
| page | int | Page number (0-based) |
| size | int | Page size |
| sortBy | string | Sort field: name, price, rating, reviews, createdAt |
| sortDir | string | Sort direction: asc or desc |

---

## Products

**Base Path:** `/api/products`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | List all products | Yes |
| GET | `/api/products/{id}` | Get product by ID | Yes |
| POST | `/api/products` | Create a product | Yes |
| PUT | `/api/products/{id}` | Update a product | Yes |
| DELETE | `/api/products/{id}` | Delete a product | Yes |

### List products (with optional gender filter)

```http
GET /api/products?gender=Male
```

---

## Orders

**Base Path:** `/api/orders`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | List all orders | Yes |
| GET | `/api/orders/{id}` | Get order by ID | Yes |
| POST | `/api/orders` | Create an order | Yes |
| PUT | `/api/orders/{id}` | Update an order | Yes |
| PUT | `/api/orders/{id}/status` | Update order status | Yes |
| DELETE | `/api/orders/{id}` | Delete an order | Yes |
| POST | `/api/orders/{id}/confirm-email` | Send confirmation email | Yes |
| POST | `/api/orders/{id}/request-otp` | Request OTP for order | No |
| POST | `/api/orders/{id}/verify-otp` | Verify OTP for order | No |
| POST | `/api/orders/{id}/skip-verify` | Skip OTP verification | No |

### Update order status

```http
PUT /api/orders/{id}/status
Content-Type: application/json

{
  "status": "Shipped"
}
```

---

## Customers

**Base Path:** `/api/customers`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/customers` | List all customers | Yes |
| GET | `/api/customers/{id}` | Get customer by ID | Yes |
| POST | `/api/customers` | Create a customer | Yes |
| PUT | `/api/customers/{id}` | Update a customer | Yes |
| DELETE | `/api/customers/{id}` | Delete a customer | Yes |

---

## Coupons

**Base Path:** `/api/coupons`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/coupons` | List all coupons | Yes |
| GET | `/api/coupons/{id}` | Get coupon by ID | Yes |
| GET | `/api/coupons/code/{code}` | Get coupon by code | Yes |
| POST | `/api/coupons` | Create a coupon | Yes |
| PUT | `/api/coupons/{id}` | Update a coupon | Yes |
| DELETE | `/api/coupons/{id}` | Delete a coupon | Yes |
| POST | `/api/coupons/validate` | Validate coupon and calculate discount | Yes |

### Validate coupon

```http
POST /api/coupons/validate
Content-Type: application/json

{
  "code": "SUMMER20",
  "orderTotal": 100.00
}
```

---

## Shipments

**Base Path:** `/api/shipments`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/shipments` | List all shipments | Yes |
| GET | `/api/shipments/{id}` | Get shipment by ID | Yes |
| GET | `/api/shipments/order/{orderId}` | Get shipment by order ID | Yes |
| POST | `/api/shipments` | Create a shipment | Yes |
| PUT | `/api/shipments/{id}` | Update a shipment | Yes |
| PUT | `/api/shipments/{id}/status` | Update shipment status | Yes |
| DELETE | `/api/shipments/{id}` | Delete a shipment | Yes |

### Update shipment status

```http
PUT /api/shipments/{id}/status
Content-Type: application/json

{
  "status": "shipped"
}
```

---

## Shipping Vendors

**Base Path:** `/api/vendors`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/vendors` | List all vendors | Yes |
| GET | `/api/vendors/{id}` | Get vendor by ID | Yes |
| POST | `/api/vendors` | Create a vendor | Yes |
| PUT | `/api/vendors/{id}` | Update a vendor | Yes |
| DELETE | `/api/vendors/{id}` | Delete a vendor | Yes |

---

## Cash Flow

**Base Path:** `/api/cash-flow`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cash-flow` | List all transactions | Yes |
| GET | `/api/cash-flow/{id}` | Get transaction by ID | Yes |
| GET | `/api/cash-flow/type/{type}` | Get transactions by type | Yes |
| GET | `/api/cash-flow/range` | Get transactions by date range | Yes |
| POST | `/api/cash-flow` | Create a transaction | Yes |
| PUT | `/api/cash-flow/{id}` | Update a transaction | Yes |
| DELETE | `/api/cash-flow/{id}` | Delete a transaction | Yes |
| GET | `/api/cash-flow/summary` | Get cash flow summary | Yes |
| GET | `/api/cash-flow/summary/range` | Get summary by date range | Yes |

### Get transactions by date range

```http
GET /api/cash-flow/range?from=2024-01-01T00:00:00&to=2024-12-31T23:59:59
```

---

## Product Returns

**Base Path:** `/api/returns`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/returns` | List all| GET | `/ returns | Yes |
api/returns/{id}` | Get return by ID | Yes |
| GET | `/api/returns/order/{orderId}` | Get returns by order ID | Yes |
| GET | `/api/returns/status/{status}` | Get returns by status | Yes |
| POST | `/api/returns` | Create a return request | Yes |
| PUT | `/api/returns/{id}` | Update a return | Yes |
| POST | `/api/returns/{id}/approve` | Approve a return | Yes |
| POST | `/api/returns/{id}/reject` | Reject a return | Yes |
| DELETE | `/api/returns/{id}` | Delete a return | Yes |

---

## Admin - Users

**Base Path:** `/api/admin/users`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | List all users | Yes (Admin) |
| GET | `/api/admin/users/{id}` | Get user by ID | Yes (Admin) |
| PUT | `/api/admin/users/{id}` | Update user details | Yes (Admin) |
| PATCH | `/api/admin/users/{id}/role` | Update user role | Yes (Admin) |
| PATCH | `/api/admin/users/{id}/activate` | Activate a user | Yes (Admin) |
| PATCH | `/api/admin/users/{id}/deactivate` | Deactivate a user | Yes (Admin) |
| DELETE | `/api/admin/users/{id}` | Delete a user | Yes (Admin) |
| POST | `/api/admin/users/{id}/reset-password` | Reset user password | Yes (Admin) |
| POST | `/api/admin/users/create-admin` | Create a new admin user | Yes (Admin) |

### Update user role

```http
PATCH /api/admin/users/{id}/role
Content-Type: application/json

{
  "role": "ADMIN"
}
```

### Reset password

```http
POST /api/admin/users/{id}/reset-password
Content-Type: application/json

{
  "newPassword": "newSecurePass123"
}
```

### Create admin

```http
POST /api/admin/users/create-admin
Content-Type: application/json

{
  "email": "newadmin@janesjeans.com",
  "password": "admin123",
  "firstName": "New",
  "lastName": "Admin"
}
```

---

## Admin - Audit Logs

**Base Path:** `/api/admin/audit-logs`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/audit-logs` | List audit logs (paginated) | Yes (Admin) |
| POST | `/api/admin/audit-logs` | Create an audit log entry | Yes (Admin) |

### List audit logs

```http
GET /api/admin/audit-logs?action=LOGIN&userId=abc123&page=0&limit=20
```

| Parameter | Type | Description |
|-----------|------|-------------|
| action | string | Filter by action |
| userId | string | Filter by user ID |
| page | int | Page number (0-based) |
| limit | int | Page size (default: 20) |

---

## Data Models

### AuthResponse

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

### User

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

### Product

```json
{
  "id": "product-id",
  "name": "Classic Skinny Jeans",
  "description": "Premium quality skinny jeans",
  "price": 79.99,
  "stockLevel": 100,
  "gender": "Female",
  "fit": "Skinny",
  "wash": "Dark",
  "imageUrl": "/images/jeans.jpg"
}
```

### Order

```json
{
  "id": "order-id",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "status": "Pending",
  "totalAmount": 159.98,
  "shippingAddress": "123 Main St, City 12345",
  "notes": "Payment: COD | Phone: +1234567890",
  "items": [
    {
      "productId": "prod-1",
      "productName": "Classic Skinny Jeans",
      "size": "M",
      "quantity": 2,
      "price": 79.99
    }
  ],
  "createdAt": "2024-01-01T00:00:00"
}
```

### ShopProduct

```json
{
  "id": "shop-product-id",
  "name": "Classic Skinny Jeans",
  "description": "Premium quality skinny jeans",
  "price": 79.99,
  "category": "jeans",
  "subcategory": "skinny",
  "sizes": ["XS", "S", "M", "L", "XL"],
  "colors": ["Dark Blue", "Black", "Light Blue"],
  "images": ["/images/jeans.jpg"],
  "inStock": true,
  "rating": 4.5,
  "reviews": 128
}
```

### PaginatedCatalogResponse

```json
{
  "content": [...],
  "page": 0,
  "size": 12,
  "totalElements": 100,
  "totalPages": 9,
  "last": false,
  "first": true
}
```

---

## Error Responses

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | janesjeans |
| `DB_USERNAME` | Database username | root |
| `DB_PASSWORD` | Database password | password |
| `JWT_SECRET` | JWT secret key | (default secret) |
| `MAIL_HOST` | SMTP host | smtp.gmail.com |
| `MAIL_PORT` | SMTP port | 587 |
| `MAIL_USERNAME` | SMTP username | (empty) |
| `MAIL_PASSWORD` | SMTP password | (empty) |
| `CORS_ALLOWED_ORIGINS` | CORS allowed origins | localhost:5173, localhost:3000 |

---

## Swagger UI

Access the interactive API documentation at:
- **Local:** `http://localhost:8080/swagger-ui.html`
- **API Docs:** `http://localhost:8080/v3/api-docs`
