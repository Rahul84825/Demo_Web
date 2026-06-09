# DemoMart - MERN Ecommerce Demo Template

A completely generic, fully functional ecommerce demo project built on the MERN stack. This repository serves as a showcase template for future clients.

## Features

- **Full-Stack MERN Architecture:** Built using MongoDB, Express.js, React.js, and Node.js.
- **Admin Dashboard:** Complete management of products, categories, hero banners, and coupons.
- **Order Management:** Track and update order statuses manually (Placed -> Preparing -> Ready -> Picked Up -> Delivered).
- **Automated Mock Integrations:** Payments and delivery tracking have been mocked to simulate a complete e-commerce flow without the need for external API credentials.
- **Real-Time Updates:** Socket.io integration for instant status updates across clients and admin.
- **Responsive UI:** Built with Tailwind CSS and Vite.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Socket.io-client.
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT Authentication.

## Setup Instructions

### 1. Clone & Install
\`\`\`bash
git clone <repository-url> demo_web
cd demo_web

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
\`\`\`

### 2. Environment Variables
Minimal `.env.example` files are provided in both `backend` and `frontend` directories.
Copy them to `.env`:

**Backend (`backend/.env`):**
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/demo_ecommerce
JWT_SECRET=demo_jwt_secret_key_12345
NODE_ENV=development
\`\`\`

**Frontend (`frontend/.env`):**
\`\`\`env
VITE_API_URL=http://localhost:5000
VITE_DEMOPAYMENT_KEY_ID=rzp_demo_key
\`\`\`

### 3. Seed the Database
Ensure your MongoDB instance is running, then run the seed script to populate categories, dummy products, coupons, and the admin user:
\`\`\`bash
cd backend
npm run seed
\`\`\`

### 4. Run the Project
Start both servers in parallel:

**Backend:**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

## Demo Credentials

You can log in to the admin dashboard using the following generated credentials:

- **Admin Login:** `admin@gmail.com`
- **Password:** `Admin@AppData\Local\Microsoft\OneDrive\logs\Personal\SyncEngine-2026-06-09.0815.10112.123.odl`

---
*This repository has been fully sanitized to remove all production and client-specific data. It is ready to be presented to prospective clients.*