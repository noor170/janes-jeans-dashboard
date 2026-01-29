# Jane's Jeans - Spring Boot Authentication Backend

## Overview
This is a complete Spring Boot 3 + Java 17 authentication backend with JWT for the Jane's Jeans application.

## Features
- ✅ JWT Authentication with access & refresh tokens
- ✅ Spring Security 6 configuration
- ✅ Role-based access control (USER, ADMIN, SUPER_ADMIN)
- ✅ User management endpoints for admins
- ✅ Password encryption with BCrypt
- ✅ CORS configuration for Lovable frontend
- ✅ Global exception handling
- ✅ Input validation

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/admin/login` | Admin-only login | No |
| POST | `/refresh` | Refresh access token | Yes (Refresh Token) |
| GET | `/validate` | Validate current token | Yes |

### Admin User Management (`/api/admin`)
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | ADMIN |
| GET | `/users/{id}` | Get user by ID | ADMIN |
| PUT | `/users/{id}` | Update user | ADMIN |
| PATCH | `/users/{id}/role` | Change user role | SUPER_ADMIN |
| PATCH | `/users/{id}/deactivate` | Deactivate user | ADMIN |
| PATCH | `/users/{id}/activate` | Activate user | ADMIN |
| DELETE | `/users/{id}` | Delete user | SUPER_ADMIN |
| POST | `/users/{id}/reset-password` | Reset user password | ADMIN |
| POST | `/users/create-admin` | Create admin user | SUPER_ADMIN |

## Setup Instructions

### 1. Prerequisites
- Java 17+
- PostgreSQL database
- Maven 3.8+

### 2. Create the project
```bash
# Using Spring Initializr CLI or website
spring init --dependencies=web,security,data-jpa,postgresql,lombok,validation \
  --java-version=17 --type=maven-project janes-jeans-api
```

### 3. Database Setup
```sql
CREATE DATABASE janesjeans;
```

### 4. Environment Variables
```bash
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
export JWT_SECRET=your-256-bit-secret-key-here-make-it-long-and-secure-at-least-32-chars
```

### 5. Run the application
```bash
mvn spring-boot:run
```

### 6. Create initial admin user
```bash
# After running the app, use psql or any SQL client
INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@janesjeans.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGP6QIVtxQFpxXvLZZCJR1Fn.PAi', -- password: admin123
  'Admin',
  'User',
  'SUPER_ADMIN',
  true,
  NOW(),
  NOW()
);
```

## Frontend Integration

### Login Request
```typescript
const response = await fetch('http://localhost:8080/api/auth/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
// Store tokens
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);
```

### Authenticated Requests
```typescript
const response = await fetch('http://localhost:8080/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  }
});
```

### Token Refresh
```typescript
const response = await fetch('http://localhost:8080/api/auth/refresh', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
  }
});
```

## Deployment Options

### Railway
```bash
railway login
railway init
railway up
```

### Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### AWS Elastic Beanstalk
```bash
eb init
eb create production
eb deploy
```

## Security Notes
- Change the default JWT secret in production
- Use HTTPS in production
- Store tokens securely (httpOnly cookies recommended for web apps)
- Implement rate limiting for login attempts
- Add audit logging for admin actions
