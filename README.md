# Pharmacy Backend API

Production-ready backend API for a pharmacy e-commerce platform, built with `Node.js`, `Express`, and `MongoDB`.

It provides secure authentication, role-based authorization, product and order workflows, prescription uploads, and admin dashboard endpoints in a modular structure.

## Key Features

- JWT-based authentication with password hashing
- Role-based access control (`user` / `admin`)
- RESTful modules for auth, users, products, orders, prescriptions, and dashboard
- Request validation using `express-validator`
- Centralized error handling with consistent JSON responses
- Prescription file upload support (`PDF`, `JPG`, `PNG`, `WEBP`)
- Security and operational middleware (`helmet`, `cors`, `morgan`)
- Health endpoint for uptime checks and monitoring
- Development seed routine for sample catalog data

## Tech Stack

- Node.js (ES Modules)
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) + `bcryptjs`
- Multer (file uploads)
- express-validator
- CORS, Helmet, Morgan

## API Modules

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive token
- `GET /api/users` - List users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `POST /api/orders` - Create order
- `GET /api/orders` - List all orders (admin only)
- `GET /api/orders/user/:id` - List orders for a user
- `PUT /api/orders/:id` - Update order status (admin only)
- `POST /api/prescriptions` - Upload prescription
- `GET /api/prescriptions` - List prescriptions (admin only)
- `PUT /api/prescriptions/:id` - Update prescription status (admin only)
- `GET /api/dashboard` - Admin dashboard summary
- `GET /api/health` - Health check

## Getting Started

### Prerequisites

- Node.js `>= 20`
- MongoDB database

### Installation

```bash
npm install
```

### Environment Setup

Create a local environment file from the example:

```bash
cp .env.example .env
```

If you are on Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then configure the required values in `.env`.

### Run the Server

```bash
npm run dev
```

Server default URL: `http://localhost:5000`

## Environment Variables

Use `.env.example` as the reference template.

- `PORT` - API server port
- `NODE_ENV` - Runtime mode (`development` or `production`)
- `MONGO_URI` - MongoDB connection string
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for token signing
- `JWT_EXPIRES_IN` - JWT expiration time
- `CORS_ORIGIN` - Allowed frontend origin(s), comma-separated

## Available Scripts

- `npm run dev` - Start server
- `npm run dev:watch` - Start server with `nodemon`
- `npm start` - Start server (production command)
- `npm run seed` - Seed sample product data

## Deployment Notes

- Configure all required environment variables in your hosting provider
- Ensure MongoDB network access is properly configured
- Set strict `CORS_ORIGIN` values for production
- Verify service health via `GET /api/health`

## Security Notes

- Do not commit `.env` or any credentials to source control
- Use strong, unique secrets in production
- Review and restrict any development seed behavior before production release
- Keep dependencies updated and monitor logs regularly

