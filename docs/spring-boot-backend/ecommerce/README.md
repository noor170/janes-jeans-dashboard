# E-Commerce Guest Checkout Backend

This module provides the Spring Boot REST API for the guest checkout e-commerce functionality.

## Features
- ✅ Guest checkout (no authentication required)
- ✅ Product listing with filters (category, price)
- ✅ Order creation with items, shipping, and payment
- ✅ Email confirmation on order placement
- ✅ Support for Card and bKash payments

## API Endpoints

### Products API (`/api/products`)

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/` | Get all products | `category`, `minPrice`, `maxPrice` |
| GET | `/{id}` | Get product by ID | - |

### Orders API (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new order | No |
| GET | `/{orderNumber}` | Get order details | No |

## Order Request Payload

```json
{
  "items": [
    {
      "productId": "prod-001",
      "productName": "Classic Cotton T-Shirt",
      "size": "M",
      "quantity": 2,
      "price": 29.99
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
    "type": "card",
    "status": "SUCCESS"
  }
}
```

## Email Configuration

Add to `application.yml`:

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true

app:
  name: Jane's Jeans
```

## Database Schema

The following tables are created automatically:

- `products` - Product catalog
- `orders` - Order records
- `order_items` - Order line items
- `shipment_details` - Shipping information

## Dependencies (pom.xml additions)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```
