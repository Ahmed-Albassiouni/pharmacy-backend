# Pharmacy E-Commerce Backend (Node.js + Express + MongoDB Atlas)

A complete backend API for a pharmacy web application with:
- JWT auth
- Role-based access (user/admin)
- Product, order, user, prescription, and dashboard management
- Multer file uploads
- Validation and global error handling
- Automatic seed data on first run

## Stack

- Node.js
- Express.js
- MongoDB Atlas + Mongoose
- JWT + bcrypt
- Multer
- express-validator
- CORS + morgan + helmet

## Local Run

```bash
npm install
cp .env.example .env
npm run dev
```

Server URL:
- `http://localhost:5000`

Health check:
- `GET http://localhost:5000/api/health`

## Environment Variables

Use `.env.example` as reference:

- `PORT=5000`
- `NODE_ENV=development`
- `MONGO_URI=<your_mongodb_uri>`
- `DB_NAME=pharmacy_db`
- `JWT_SECRET=<long_random_secret>`
- `JWT_EXPIRES_IN=7d`
- `CORS_ORIGIN=http://localhost:5173` (optional, comma-separated for multiple origins)

Important:
- In production, `MONGO_URI` and `JWT_SECRET` are required.
- The app now fails fast with a clear startup error if either is missing in production.

## Deploy on Render

This repository includes `render.yaml` with:
- `buildCommand: npm ci --omit=dev`
- `startCommand: npm start`
- `healthCheckPath: /api/health`

### Render Setup Steps

1. Create a new **Web Service** from this repo (Render detects `render.yaml` automatically).
2. Set environment variables in Render dashboard:
   - `NODE_ENV=production`
   - `MONGO_URI`
   - `DB_NAME=pharmacy_db` (or your custom DB name)
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=7d` (optional)
   - `CORS_ORIGIN=https://your-frontend-domain.com` (optional but recommended)
3. In MongoDB Atlas Network Access, allow Render access:
   - Add `0.0.0.0/0` (quick setup), or
   - Restrict to your allowed egress IP strategy.
4. Deploy and test:
   - `GET https://<your-render-service>/api/health`

## Default Seed Users

Auto-created on first successful DB connection:

- Admin:
  - Email: `admin@pharmacy.com`
  - Password: `Admin@12345`
- User:
  - Email: `user@pharmacy.com`
  - Password: `User@12345`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users (Admin Only)
- `GET /api/users`
- `DELETE /api/users/:id`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (Admin)
- `PUT /api/products/:id` (Admin)
- `DELETE /api/products/:id` (Admin)

### Orders
- `POST /api/orders` (Authenticated user/admin)
- `GET /api/orders` (Admin)
- `GET /api/orders/user/:id` (Admin or same user)
- `PUT /api/orders/:id` (Admin)

### Prescriptions
- `POST /api/prescriptions` (Authenticated, multipart/form-data with `file`)
- `GET /api/prescriptions` (Admin)
- `PUT /api/prescriptions/:id` (Admin)

### Dashboard
- `GET /api/dashboard` (Admin)

## Notes

- Product `status` is auto-managed from stock:
  - `available` when `stock > 0`
  - `out-of-stock` when `stock = 0`
- Payment method placeholders supported in orders:
  - `vodafone_cash`
  - `credit_card`
  - `cash_on_delivery`
- Uploaded prescription files are served from:
  - `/uploads/<filename>`
- `uploads` storage on Render is ephemeral; use object storage (S3/Cloudinary/etc.) if you need persistent files.
