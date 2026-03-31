# Pharmacy E-Commerce Backend (Node.js + Express + MongoDB)

A complete backend API for a pharmacy web application with:
- JWT authentication
- Role-based access (user/admin)
- Product, order, user, prescription, and dashboard management
- File uploads
- Validation and global error handling

## Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Multer
- express-validator
- CORS + morgan + helmet

## Local Run

```bash
npm install
cp .env.example .env
npm run dev

## Server

Server URL:
- http://localhost:5000

Health check:
- GET /api/health

---

## Environment Variables

Use `.env.example` as reference:

- PORT
- NODE_ENV
- MONGO_URI
- DB_NAME
- JWT_SECRET
- JWT_EXPIRES_IN
- CORS_ORIGIN

---

## Deploy

This project is ready for deployment on platforms like Render.

### General Deployment Steps

1. Create a new web service from this repository.
2. Set environment variables in your hosting platform.
3. Ensure MongoDB connection is allowed.
4. Deploy and test using the health check endpoint.

---

## Default Seed Users

Admin and test users are created automatically on first run.

⚠️ For security, change or disable seed users in production.

---

## API Endpoints

## Auth
- POST /api/auth/register
- POST /api/auth/login

## Users (Admin Only)
- GET /api/users
- DELETE /api/users/:id

## Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (Admin)
- PUT /api/products/:id (Admin)
- DELETE /api/products/:id (Admin)

## Orders
- POST /api/orders
- GET /api/orders
- GET /api/orders/user/:id
- PUT /api/orders/:id

## Prescriptions
- POST /api/prescriptions
- GET /api/prescriptions
- PUT /api/prescriptions/:id

## Dashboard
- GET /api/dashboard