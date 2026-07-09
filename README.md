# Lucknow Cart

Lucknow Cart is a full-stack local marketplace web app where customers discover local vendors, shop products, manage cart, and place orders, while admins manage vendors, products, users, and orders.

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Axios, React Hook Form, React Context API
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Image Upload:** Cloudinary

## Project Structure

```text
lucknow-cart/
├── frontend/
├── backend/
└── README.md
```

## Features

### Customer
- Register/Login/Logout
- Profile update
- Browse vendors/products
- Product search and category filtering
- Product details
- Cart management
- Mock checkout and place order
- Order history

### Admin
- Secure admin login
- Dashboard stats (products/vendors/users/orders)
- Vendor CRUD
- Product CRUD
- View users
- View and update order status

## Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run build
npm run dev
```

### Backend Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/lucknow_cart
JWT_SECRET=super_secret_change_me
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Seed Admin User

```bash
npm run seed:admin
```

Default admin credentials:
- **Email:** `admin@lucknowcart.com`
- **Password:** `Admin@123`

## Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run build
npm run dev
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Run Full App

1. Start MongoDB
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Open `http://localhost:3000`

## API Modules

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`
- `GET /api/auth/me`
- `PUT /api/users/profile`
- `GET /api/users` (admin)
- Vendor CRUD: `/api/vendors`
- Product CRUD + list/search: `/api/products`
- Cart APIs: `/api/cart`
- Order APIs: `/api/orders`
- Admin stats: `GET /api/admin/stats`

## Build Verification

- Backend build: `cd backend && npm run build` ✅
- Frontend build: `cd frontend && npm run build` ✅
- Frontend lint: `cd frontend && npm run lint` ✅ (warnings only for `<img>` optimization)
