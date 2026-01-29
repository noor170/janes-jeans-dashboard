# 👖 Jane's Jeans - E-Commerce Platform

<div align="center">

![Jane's Jeans Logo](https://img.shields.io/badge/Jane's%20Jeans-E--Commerce-blue?style=for-the-badge&logo=shopify&logoColor=white)

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat-square&logo=spring)](https://spring.io/projects/spring-boot)
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
- [Installation](#-installation)
- [Docker Deployment](#-docker-deployment)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Resources Used](#-resources-used)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**Jane's Jeans** is a comprehensive e-commerce platform designed for clothing retail businesses. It features a modern React frontend with a clean, responsive UI and a robust Spring Boot backend API. The platform supports both authenticated admin operations and guest checkout for customers.

### Key Highlights

- 🛒 **Guest Checkout Flow** - Customers can browse and purchase without creating an account
- 👔 **Product Catalog** - Dynamic product listings with filtering and search
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
| 📦 **Product Details** | View high-quality images, descriptions, sizes, and colors |
| 🛒 **Shopping Cart** | Add, remove, and manage items with real-time price updates |
| 📝 **Checkout Flow** | Multi-step checkout with shipment details collection |
| 💳 **Payment Options** | Support for Card and bKash payment methods |
| ✅ **Order Confirmation** | Success page with order summary and email confirmation |

### Admin Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard Analytics** | User statistics, growth charts, and activity feeds |
| 👥 **User Management** | Create, edit, deactivate, and manage admin users |
| 📋 **Order Management** | View and process customer orders |
| 📦 **Inventory Control** | Manage product stock and details |
| 🚚 **Shipment Tracking** | Track and manage shipments |
| 📈 **Audit Logs** | Complete activity logging for compliance |
| 🌐 **Multi-language** | Support for English and Bengali |

### Technical Features

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Secure token-based authentication |
| 🛡️ **Role-Based Access** | USER, ADMIN, and SUPER_ADMIN roles |
| 📱 **Responsive Design** | Mobile-first, works on all devices |
| 🌙 **Dark Mode** | Toggle between light and dark themes |
| ⚡ **Real-time Updates** | React Query for efficient data fetching |
| 🐳 **Docker Ready** | Containerized deployment support |

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
| [React Hook Form](https://react-hook-form.com/) | 7.x | Form Management |
| [Zod](https://zod.dev/) | 3.x | Schema Validation |
| [Recharts](https://recharts.org/) | 2.x | Charts & Analytics |
| [Lucide React](https://lucide.dev/) | Latest | Icons |
| [Sonner](https://sonner.emilkowal.ski/) | 1.x | Toast Notifications |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| [Java](https://openjdk.org/) | 17 | Programming Language |
| [Spring Boot](https://spring.io/projects/spring-boot) | 3.x | Framework |
| [Spring Security](https://spring.io/projects/spring-security) | 6.x | Authentication |
| [Spring Data JPA](https://spring.io/projects/spring-data-jpa) | 3.x | Database Access |
| [PostgreSQL](https://www.postgresql.org/) | 15.x | Database |
| [JWT (jjwt)](https://github.com/jwtk/jjwt) | 0.11.x | Token Authentication |
| [Lombok](https://projectlombok.org/) | Latest | Boilerplate Reduction |
| [Spring Mail](https://spring.io/guides/gs/sending-email/) | 3.x | Email Service |

### DevOps & Tools

| Technology | Purpose |
|------------|---------|
| [Docker](https://www.docker.com/) | Containerization |
| [Docker Compose](https://docs.docker.com/compose/) | Multi-container Orchestration |
| [Nginx](https://nginx.org/) | Web Server / Reverse Proxy |
| [GitHub Actions](https://github.com/features/actions) | CI/CD Pipeline |
| [ESLint](https://eslint.org/) | Code Linting |
| [Vitest](https://vitest.dev/) | Testing Framework |

---

## 📁 Project Structure

```
janes-jeans/
├── 📂 public/                    # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── 📂 src/                       # Frontend source code
│   ├── 📂 components/            # React components
│   │   ├── 📂 admin/             # Admin-specific components
│   │   │   ├── CreateAdminDialog.tsx
│   │   │   ├── EditUserDialog.tsx
│   │   │   └── ResetPasswordDialog.tsx
│   │   ├── 📂 shop/              # E-commerce components
│   │   │   ├── CartIcon.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── CheckoutSteps.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductFilters.tsx
│   │   ├── 📂 ui/                # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (50+ components)
│   │   ├── AdminButton.tsx
│   │   ├── AppSidebar.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── ...
│   │
│   ├── 📂 contexts/              # React Context providers
│   │   ├── AuthContext.tsx       # Authentication state
│   │   ├── CartContext.tsx       # Shopping cart state
│   │   ├── GenderFilterContext.tsx
│   │   ├── LanguageContext.tsx   # i18n support
│   │   └── NotificationContext.tsx
│   │
│   ├── 📂 data/                  # Static data & mocks
│   │   ├── mockData.ts           # Dashboard mock data
│   │   └── shopProducts.ts       # Product catalog
│   │
│   ├── 📂 hooks/                 # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── usePagination.ts
│   │   └── useSorting.ts
│   │
│   ├── 📂 lib/                   # Utilities & services
│   │   ├── api.ts                # API client
│   │   ├── authApi.ts            # Auth API service
│   │   ├── auditLogService.ts    # Audit logging
│   │   ├── exportCsv.ts          # CSV export utility
│   │   ├── translations.ts       # i18n translations
│   │   └── utils.ts              # Helper functions
│   │
│   ├── 📂 pages/                 # Page components
│   │   ├── 📂 shop/              # E-commerce pages
│   │   │   ├── ShoppingDashboard.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── PaymentPage.tsx
│   │   │   └── OrderSuccessPage.tsx
│   │   ├── AdminDashboard.tsx    # Admin analytics
│   │   ├── AdminLogin.tsx        # Login page
│   │   ├── Analytics.tsx
│   │   ├── Customers.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Inventory.tsx
│   │   ├── Orders.tsx
│   │   ├── Settings.tsx
│   │   ├── Shipments.tsx
│   │   └── UserManagement.tsx
│   │
│   ├── 📂 types/                 # TypeScript definitions
│   │   ├── auth.ts
│   │   ├── auditLog.ts
│   │   ├── index.ts
│   │   └── notifications.ts
│   │
│   ├── App.tsx                   # Main App component
│   ├── App.css                   # Global styles
│   ├── index.css                 # Tailwind imports
│   └── main.tsx                  # Entry point
│
├── 📂 docs/                      # Documentation
│   └── 📂 spring-boot-backend/   # Backend implementation docs
│       ├── 📂 config/            # Security configuration
│       ├── 📂 controller/        # REST controllers
│       ├── 📂 dto/               # Data transfer objects
│       ├── 📂 entity/            # JPA entities
│       ├── 📂 repository/        # Data repositories
│       ├── 📂 service/           # Business logic
│       ├── Application.java
│       ├── application.yml
│       └── README.md
│
├── 📂 scripts/                   # Utility scripts
│   └── init-db.sql               # Database initialization
│
├── 📂 supabase/                  # Supabase configuration
│   └── config.toml
│
├── 📄 Dockerfile                 # Frontend container
├── 📄 docker-compose.yml         # Production orchestration
├── 📄 docker-compose.dev.yml     # Development override
├── 📄 nginx.conf                 # Nginx configuration
├── 📄 .dockerignore              # Docker ignore rules
├── 📄 .env.example               # Environment template
├── 📄 package.json               # Node dependencies
├── 📄 tailwind.config.ts         # Tailwind configuration
├── 📄 vite.config.ts             # Vite configuration
├── 📄 tsconfig.json              # TypeScript configuration
└── 📄 README.md                  # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or **bun** 1.x)
- **Java** 17 or higher (for backend)
- **PostgreSQL** 15.x (or use Docker)
- **Docker** & **Docker Compose** (optional, for containerized deployment)

### Quick Start (Frontend Only)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/janes-jeans.git
cd janes-jeans

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Full Stack Setup

#### Step 1: Database Setup

```bash
# Using Docker (recommended)
docker run -d \
  --name janes-jeans-db \
  -e POSTGRES_DB=janesjeans \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Or install PostgreSQL locally and create database
psql -U postgres -c "CREATE DATABASE janesjeans;"
```

#### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd docs/spring-boot-backend

# Build the project (if using Maven)
mvn clean install

# Run the application
mvn spring-boot:run

# Or using the JAR
java -jar target/janes-jeans-api-1.0.0.jar
```

#### Step 3: Frontend Setup

```bash
# Return to project root
cd ../..

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Frontend
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Backend (set in application.yml or environment)
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-256-bit-secret-key-here
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

---

## 🐳 Docker Deployment

### Production Deployment

```bash
# 1. Clone and navigate to project
git clone https://github.com/your-username/janes-jeans.git
cd janes-jeans

# 2. Create environment file
cp .env.example .env
# Edit .env with your production values

# 3. Build and start all services
docker-compose up -d --build

# 4. Check service status
docker-compose ps

# 5. View logs
docker-compose logs -f
```

### Service URLs (Production)

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React application |
| Backend API | http://localhost:8080 | Spring Boot API |
| PostgreSQL | localhost:5432 | Database |
| pgAdmin | http://localhost:5050 | Database management (optional) |

### Development with Docker

```bash
# Start with development overrides
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# This enables:
# - Hot reloading for frontend
# - Volume mounts for live code changes
# - Debug logging
```

### Docker Commands Reference

```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart [service_name]

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Start with pgAdmin tool
docker-compose --profile tools up -d

# Scale services
docker-compose up -d --scale backend=3
```

### Backend Dockerfile (for `backend/` directory)

Create `backend/Dockerfile`:

```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 📖 Usage

### Customer Flow

1. **Browse Products**: Visit `/shop` to see the product catalog
2. **Filter & Search**: Use category and price filters
3. **View Details**: Click on any product for full details
4. **Add to Cart**: Select size and add items to cart
5. **Checkout**: Fill in shipping details
6. **Payment**: Choose Card or bKash payment
7. **Confirmation**: Receive order confirmation

### Admin Flow

1. **Login**: Navigate to `/admin-login`
2. **Dashboard**: View analytics at `/admin`
3. **Manage Users**: Access `/user-management`
4. **View Orders**: Check `/orders`
5. **Inventory**: Manage products at `/inventory`
6. **Audit Logs**: Review activity at `/audit-logs`

### Default Admin Credentials

```
Email: admin@janesjeans.com
Password: admin123
```

⚠️ **Important**: Change these credentials immediately in production!

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/admin/login` | Admin login | ❌ |
| POST | `/api/auth/refresh` | Refresh token | 🔄 |
| GET | `/api/auth/validate` | Validate token | ✅ |

### Product Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List all products | ❌ |
| GET | `/api/products/{id}` | Get product by ID | ❌ |
| GET | `/api/products?category=JEANS` | Filter by category | ❌ |
| GET | `/api/products?minPrice=20&maxPrice=100` | Filter by price | ❌ |

### Order Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create new order | ❌ |
| GET | `/api/orders/{orderNumber}` | Get order details | ❌ |

### Admin Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | List all users | ADMIN |
| GET | `/api/admin/users/{id}` | Get user by ID | ADMIN |
| PUT | `/api/admin/users/{id}` | Update user | ADMIN |
| PATCH | `/api/admin/users/{id}/role` | Change role | SUPER_ADMIN |
| PATCH | `/api/admin/users/{id}/deactivate` | Deactivate user | ADMIN |
| PATCH | `/api/admin/users/{id}/activate` | Activate user | ADMIN |
| DELETE | `/api/admin/users/{id}` | Delete user | SUPER_ADMIN |
| POST | `/api/admin/users/create-admin` | Create admin | SUPER_ADMIN |

### Request/Response Examples

#### Create Order

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
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
      "type": "CARD",
      "status": "SUCCESS"
    }
  }'
```

#### Admin Login

```bash
curl -X POST http://localhost:8080/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@janesjeans.com",
    "password": "admin123"
  }'
```

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐
│      users       │       │     products     │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ email            │       │ name             │
│ password         │       │ description      │
│ first_name       │       │ price            │
│ last_name        │       │ category         │
│ role             │       │ sizes            │
│ is_active        │       │ colors           │
│ created_at       │       │ image_url        │
│ updated_at       │       │ in_stock         │
└──────────────────┘       │ rating           │
                           │ reviews          │
                           └──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│      orders      │       │   order_items    │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │───┐   │ id (PK)          │
│ order_number     │   │   │ order_id (FK)    │──┐
│ status           │   └──▶│ product_id       │  │
│ total_amount     │       │ product_name     │  │
│ payment_type     │       │ size             │  │
│ payment_status   │       │ quantity         │  │
│ created_at       │       │ price            │  │
└────────┬─────────┘       └──────────────────┘  │
         │                                        │
         │  ┌──────────────────┐                 │
         │  │ shipment_details │                 │
         │  ├──────────────────┤                 │
         └─▶│ id (PK)          │                 │
            │ order_id (FK)    │◀────────────────┘
            │ name             │
            │ email            │
            │ phone            │
            │ address          │
            │ city             │
            │ postal_code      │
            └──────────────────┘

┌──────────────────┐
│    audit_logs    │
├──────────────────┤
│ id (PK)          │
│ action           │
│ entity_type      │
│ entity_id        │
│ user_id          │
│ user_email       │
│ details          │
│ ip_address       │
│ created_at       │
└──────────────────┘
```

### Enum Types

```sql
-- User Roles
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- Order Status
CREATE TYPE order_status AS ENUM (
  'PENDING', 'CONFIRMED', 'PROCESSING', 
  'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
);

-- Payment Type
CREATE TYPE payment_type AS ENUM ('CARD', 'BKASH', 'CASH_ON_DELIVERY');

-- Payment Status
CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- Product Category
CREATE TYPE product_category AS ENUM ('TSHIRTS', 'HOODIES', 'JEANS');

-- Audit Action
CREATE TYPE audit_action AS ENUM (
  'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT'
);
```

---

## 📚 Resources Used

### Documentation & Tutorials

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Docker Documentation](https://docs.docker.com/)

### Libraries & Tools

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [TanStack Query](https://tanstack.com/query/latest) - Powerful Data Synchronization
- [React Hook Form](https://react-hook-form.com/) - Performant Form Library
- [Zod](https://zod.dev/) - TypeScript-first Schema Validation
- [Recharts](https://recharts.org/) - Composable Charting Library
- [Lucide Icons](https://lucide.dev/) - Beautiful & Consistent Icons
- [date-fns](https://date-fns.org/) - Modern JavaScript Date Utility

### Design Resources

- [Radix UI Primitives](https://www.radix-ui.com/) - Unstyled, Accessible Components
- [Heroicons](https://heroicons.com/) - Icon Set
- [Tailwind UI](https://tailwindui.com/) - UI Component Inspiration

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/janes-jeans.git
   ```
3. **Create a branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes**
5. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Coding Standards

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Commit Message Convention

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(cart): add quantity update functionality
fix(auth): resolve token refresh issue
docs(readme): update installation instructions
```

### Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the documentation with any new environment variables
3. The PR will be merged once you have approval from maintainers

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Jane's Jeans

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Made with ❤️ by the Jane's Jeans Team**

[⬆ Back to Top](#-janes-jeans---e-commerce-platform)

</div>
