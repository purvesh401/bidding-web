# 🏺 Antique Auction Website - Real-Time Bidding Platform

A production-ready full-stack web application for managing and participating in real-time antique auctions. The platform combines a modern React frontend, a secure Express backend, and Socket.io-powered live bidding.

## ✨ Key Features

- **Real-Time Bidding:** Live price updates, bid history, and notifications through Socket.io.
- **Secure Authentication:** JWT tokens stored inside httpOnly cookies with robust validation.
- **Auction Management:** Sellers can create, update, and manage auctions with comprehensive metadata.
- **Buyer Experience:** Buyers track auctions, place bids, and monitor countdown timers in real time.
- **Responsive UI:** React Bootstrap components and Framer Motion animations for a polished UX.
- **Extensive Validation:** Shared validation rules across client and server to prevent invalid data.

## 🛠️ Tech Stack

### Frontend
- React 18 with functional components and hooks
- React Router DOM v6 for routing
- React Bootstrap UI kit + Framer Motion animations
- Socket.io client for real-time communication
- Axios with request/response interceptors
- React Toastify for user notifications

### Backend
- Node.js 18+ with Express 4
- MongoDB with Mongoose ODM
- Socket.io server for live bid broadcasts
- JWT authentication with bcrypt password hashing
- express-validator, cors, cookie-parser, dotenv, helmet, express-rate-limit

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB (local instance or Atlas cluster)

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd auction-website
   ```

2. **Configure Environment Variables**
   Copy the provided examples and update values as needed.
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. **Install Dependencies**
   ```bash
   # Backend dependencies
   cd server
   npm install

   # Frontend dependencies
   cd ../client
   npm install
   ```

4. **Run MongoDB**
   ```bash
   mongod
   ```

5. **Start Development Servers**
   ```bash
   # Backend (from /server)
   # Demo mode (no auth required)
   set DISABLE_AUTH=true&& npm run dev   # Windows CMD
   # Or PowerShell
   $env:DISABLE_AUTH="true"; npm run dev

   # Frontend (from /client)
   npm start
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 🧪 Live Demo Checklist

- Change default bid increment in `server/models/Item.js`.
- Update minimum bid validation rule in `server/controllers/bid.controller.js`.
- Adjust countdown formatting in `client/src/components/CountdownTimer.jsx`.
- Modify broadcast payload inside `server/controllers/bid.controller.js`.
- Tweak color palette via CSS variables in `client/src/index.css`.

## 📂 Project Structure

```
/auction-website
├── client/                # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       └── index.js
├── server/                # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── .gitignore
├── README.md
└── ...
```

## 🔌 Available Scripts

### Backend (`/server`)
- `npm run dev` – start backend with nodemon
- `npm start` – start backend with Node.js

### Frontend (`/client`)
- `npm start` – launch React dev server
- `npm run build` – produce production build

## 🧰 Environment Variables

Populate the `.env` files using the provided `.env.example` templates.

### Server `.env`
- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – secret used to sign JWT tokens
- `PORT` – server port (default 5000)
- `CLIENT_URL` – URL of frontend used in CORS
- `BCRYPT_ROUNDS` – bcrypt salt rounds (default 10)

### Client `.env`
- `VITE_API_URL` – API base URL (default http://localhost:5000/api)
- `VITE_SERVER_URL` – Backend root URL (default http://localhost:5000)

### Demo Mode (No Authentication)
- Set `DISABLE_AUTH=true` in `server/.env` to bypass authentication checks. In this mode, protected routes act as if a guest user is logged in, preventing auth-related errors during demos.
- Sample environment templates are provided: `server/env.example` and `client/env.example`. Copy them to `.env` in each folder.

## 🧯 Troubleshooting

- **Socket.io Connection Issues:** Confirm frontend `REACT_APP_SERVER_URL` matches backend URL and CORS credentials are enabled.
- **MongoDB Errors:** Ensure MongoDB is running and the connection string is correct.
- **Authentication Failures:** Delete browser cookies and confirm the JWT secret matches server configuration.

## 📝 License

This project is released under the MIT License.
