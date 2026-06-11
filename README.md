# DemoMart - MERN Ecommerce Demo Platform

A completely generic, fully functional, and self-contained ecommerce demo project built on the MERN stack. This repository is designed to serve as a showcase template for prospective clients, featuring modern tech-forward styling, automated mock payment/delivery logic, and a manual order status lifecycle.

## Features

- **Full-Stack MERN Architecture:** Built using MongoDB, Express.js, React.js, and Node.js.
- **Zero-Config In-Memory DB Fallback:** If a local/remote MongoDB server is not available or connection fails, the system automatically spins up a programmatically-managed `mongodb-memory-server` and auto-seeds the required demo catalog data, making the platform 100% plug-and-play out of the box!
- **Admin Dashboard:** Complete management of products, categories (Electronics, Fashion, Home, Accessories, Sports), hero banners, and coupons.
- **Order Management & Lifecycle:** Track and update order statuses manually through the custom lifecycle buttons: `Placed` -> `Accepted` -> `Preparing` -> `Ready` -> `Picked Up` -> `Delivered`.
- **Automated Mock Integrations:** Payments and delivery tracking are mocked to simulate a complete e-commerce checkout flow (`checkout.demopayment.com`) without the need for external API credentials.
- **Real-Time Updates:** Socket.io integration for instant status updates across clients and admin.
- **Responsive UI:** Built with custom Vanilla CSS styles (via a centralized design system in `GlobalStyle.jsx`) and Vite.

## Tech Stack

- **Frontend:** React 18, Vite, Vanilla CSS, React Router, Socket.io-client.
- **Backend:** Node.js, Express, MongoDB (Mongoose) / MongoDB Memory Server, Socket.io, JWT Authentication.

## Setup Instructions

### 1. Clone & Install
```bash
git clone <repository-url> demo_web
cd demo_web

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Minimal `.env.example` files are provided in both `backend` and `frontend` directories.
Copy them to `.env`:

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/demo_ecommerce
JWT_SECRET=demo_jwt_secret_key_12345
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000
VITE_DEMOPAYMENT_KEY_ID=rzp_demo_key
```

### 3. Run the Project
You can start both servers in parallel. Since the database connection has an automatic in-memory fallback, you do **not** need to have a running local MongoDB instance or manually seed it—the server handles everything on startup!

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Demo Credentials

Log in to the admin dashboard using the following generated credentials:

- **Admin Login:** `admin@gmail.com`
- **Password:** `Admin@123`

---
*This repository has been fully sanitized to remove all production and client-specific data. It is ready to be presented to prospective clients.*