# 🏺 Bidding Web - Real-Time Auction Platform

A production-ready full-stack web application for managing and participating in real-time auctions. The platform combines a modern React frontend with Vite, a secure Express backend, and Socket.io-powered live bidding features.

## ✨ Key Features

### 🎯 Core Functionality
- **Real-Time Bidding:** Live price updates, bid history, and notifications through Socket.io
- **Secure Authentication:** JWT tokens stored in httpOnly cookies with robust validation
- **Auction Management:** Create, update, and manage auction listings with comprehensive metadata
- **Countdown Timers:** Real-time countdown for each auction with automatic status updates
- **Bid History:** Complete bidding history with timestamps and bidder information
- **Image Gallery:** Multi-image support for auction items with gallery view

### 🚀 Real-Time Features
- **Live Auction Rooms:** Join dedicated rooms for active auctions
- **Real-Time Chat:** Live chat system for each auction with message history
- **Viewer Count:** See how many users are viewing each auction
- **Active Bidders:** Track active participants in real-time
- **Bid Notifications:** Instant notifications when new bids are placed
- **Socket Events:** Live updates for viewer joins/leaves, new messages, and bids

### 👤 User Features
- **User Profile:** Comprehensive profile page with view/edit modes
- **Profile Management:** Update username, email, phone number, and address
- **Profile Images:** Support for profile image URLs
- **Account Information:** View account type, member since date, and activity stats
- **Secure Updates:** Validated form submissions with error handling

### 🎨 UI/UX
- **Responsive Design:** Mobile-first approach with Bootstrap 5.3.3
- **Smooth Animations:** Framer Motion for polished transitions and interactions
- **Modern Icons:** React Icons library for consistent iconography
- **Toast Notifications:** User-friendly feedback with React Toastify
- **Loading States:** Spinner components for better user experience
- **Protected Routes:** Seamless authentication flow with redirects

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with functional components and hooks
- **Vite 7.1.12** - Fast build tool and development server
- **React Router DOM 7.1.1** - Client-side routing
- **React Bootstrap 2.10.7** - UI component library
- **Framer Motion 11.2.10** - Animation library for smooth transitions
- **Socket.io Client 4.8.1** - Real-time bidirectional communication
- **Axios 1.7.9** - HTTP client with interceptors
- **React Hook Form 7.53.0** - Form validation and management
- **React Toastify 11.0.2** - Toast notifications
- **React Icons 5.5.0** - Icon library

### Backend
- **Node.js 18+** with **Express 4.21.2**
- **MongoDB** with **Mongoose 8.9.3** ODM
- **Socket.io 4.8.1** - Real-time server for live updates
- **JWT** (jsonwebtoken 9.0.2) - Authentication tokens
- **bcryptjs 2.4.3** - Password hashing
- **express-validator 7.2.0** - Request validation
- **cors 2.8.5** - Cross-origin resource sharing
- **cookie-parser 1.4.7** - Cookie handling
- **dotenv 16.4.7** - Environment configuration
- **helmet 8.0.0** - Security headers
- **express-rate-limit 7.5.0** - Rate limiting

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** (local instance or Atlas cluster)
- **Git** for version control

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/Hitraj1601/bidding-web2.git
   cd bidding-web2
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

   Create `.env` file in `server/` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bidding-web
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

   Create `.env` file in `client/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SERVER_URL=http://localhost:5000
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud) by updating MONGODB_URI in server/.env
   ```

5. **Run Development Servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on: `http://localhost:5000`

   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```
   Application runs on: `http://localhost:5173`

6. **Access Application**
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:5000/api
   - **Socket.io:** Connected automatically via frontend

## 🧪 Live Demo Checklist

- Change default bid increment in `server/models/Item.js`.
- Update minimum bid validation rule in `server/controllers/bid.controller.js`.
- Adjust countdown formatting in `client/src/components/CountdownTimer.jsx`.
- Modify broadcast payload inside `server/controllers/bid.controller.js`.
- Tweak color palette via CSS variables in `client/src/index.css`.

## 📂 Project Structure

```
bidding-web2/
├── client/                          # React + Vite frontend
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   │   ├── BidHistoryList.jsx  # Bid history display
│   │   │   ├── BidModal.jsx        # Bid placement modal
│   │   │   ├── CountdownTimer.jsx  # Auction countdown
│   │   │   ├── ImageGallery.jsx    # Image carousel
│   │   │   ├── ItemCard.jsx        # Auction item card
│   │   │   ├── LoadingSpinner.jsx  # Loading indicator
│   │   │   └── ProtectedRoute.jsx  # Route protection
│   │   ├── context/                # React Context providers
│   │   │   ├── AuthContext.jsx     # Authentication state
│   │   │   └── SocketContext.jsx   # Socket.io connection
│   │   ├── hooks/                  # Custom React hooks
│   │   │   └── useAuth.js          # Auth hook
│   │   ├── pages/                  # Page components
│   │   │   ├── CreateListing.jsx   # Create auction page
│   │   │   ├── DashboardPage.jsx   # User dashboard
│   │   │   ├── HomePage.jsx        # Landing page
│   │   │   ├── ItemDetailPage.jsx  # Auction details
│   │   │   ├── LiveAuctionRoom.jsx # Real-time auction room
│   │   │   ├── LoginPage.jsx       # Login page
│   │   │   ├── NotFoundPage.jsx    # 404 page
│   │   │   ├── ProfilePage.jsx     # User profile
│   │   │   └── RegisterPage.jsx    # Registration page
│   │   ├── services/               # API and services
│   │   │   ├── api.js              # Axios configuration
│   │   │   └── socket.js           # Socket.io client
│   │   ├── utils/                  # Utility functions
│   │   │   ├── animationVariants.js # Framer Motion variants
│   │   │   └── formatters.js       # Data formatters
│   │   ├── App.jsx                 # Main app component
│   │   ├── index.css               # Global styles
│   │   ├── index.js                # React entry point
│   │   └── main.jsx                # Vite entry point
│   ├── index.html                  # HTML template
│   ├── package.json                # Frontend dependencies
│   └── vite.config.js              # Vite configuration
│
├── server/                          # Express.js backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/                # Request handlers
│   │   ├── auth.controller.js      # Authentication logic
│   │   ├── bid.controller.js       # Bid operations
│   │   └── item.controller.js      # Item/auction operations
│   ├── middleware/                 # Express middleware
│   │   ├── errorHandler.js         # Error handling
│   │   ├── notFoundHandler.js      # 404 handler
│   │   ├── protectRoute.js         # Auth middleware
│   │   └── validators.js           # Input validation
│   ├── models/                     # Mongoose schemas
│   │   ├── Bid.js                  # Bid model
│   │   ├── Item.js                 # Item/auction model
│   │   └── User.js                 # User model
│   ├── routes/                     # API routes
│   │   ├── auth.routes.js          # Auth endpoints
│   │   ├── bid.routes.js           # Bid endpoints
│   │   └── item.routes.js          # Item endpoints
│   ├── utils/                      # Utility functions
│   │   ├── auctionScheduler.js     # Auction timing logic
│   │   └── generateToken.js        # JWT generation
│   ├── package.json                # Backend dependencies
│   └── server.js                   # Express server + Socket.io
│
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```
```

## 🔌 Available Scripts

### Backend (`/server`)
```bash
npm run dev      # Start with nodemon (auto-restart on changes)
npm start        # Start production server
```

### Frontend (`/client`)
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🎮 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Items/Auctions
- `GET /api/items` - Get all auction items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (protected)
- `PUT /api/items/:id` - Update item (protected)
- `DELETE /api/items/:id` - Delete item (protected)

### Bids
- `GET /api/bids/item/:itemId` - Get bids for an item
- `POST /api/bids` - Place a bid (protected)
- `GET /api/bids/user` - Get user's bids (protected)

## 🔌 Socket.io Events

### Client → Server
- `join-auction` - Join auction room
- `leave-auction` - Leave auction room
- `send-message` - Send chat message
- `viewer-joined` - Notify viewer joined
- `viewer-left` - Notify viewer left

### Server → Client
- `new-bid-placed` - New bid notification
- `chat-message` - New chat message
- `viewer-count-updated` - Viewer count update
- `auction-status-changed` - Auction status update

## 🧰 Environment Variables

### Server `.env` (required)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/bidding-web
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/bidding-web

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173

# Optional
BCRYPT_ROUNDS=10
```

### Client `.env` (required)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

## 🎯 Features Walkthrough

### 1. User Authentication
- Register with username, email, and password
- Secure login with JWT tokens
- Automatic session management with httpOnly cookies
- Protected routes with authentication checks

### 2. Browse Auctions
- View all active auctions on the homepage
- Filter and search functionality
- Item cards with images, current price, and countdown
- Quick access to auction details

### 3. Create Auction
- Upload item details and images
- Set starting price and duration
- Add comprehensive item descriptions
- Manage your listings from dashboard

### 4. Real-Time Bidding
- Join live auction rooms
- Place bids with instant validation
- View real-time bid history
- Get notifications for new bids
- Countdown timer with automatic updates

### 5. Live Auction Room
- Real-time chat with other bidders
- See active viewer count
- Track active bidders
- Receive bid notifications
- Interactive bidding interface

### 6. User Profile
- View your profile information
- Edit mode for updating details
- Update username, email, phone
- Manage address information
- Upload profile image URL
- View account statistics

### 7. Dashboard
- Overview of your active bids
- Track your auction items
- Monitor auction performance
- Quick access to item management

## 🧯 Troubleshooting

### Common Issues

**Socket.io Connection Issues**
- Verify `VITE_SERVER_URL` in client `.env` matches backend URL
- Check CORS configuration in `server/server.js`
- Ensure both servers are running
- Clear browser cookies and cache

**MongoDB Connection Errors**
- Confirm MongoDB is running: `mongod` or check Atlas cluster
- Verify `MONGODB_URI` format is correct
- Check network connectivity for Atlas
- Ensure database user has proper permissions

**Authentication Failures**
- Clear browser cookies
- Verify `JWT_SECRET` matches between requests
- Check token expiration settings
- Ensure httpOnly cookie settings are correct

**Port Already in Use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Linux/Mac
lsof -i :5000
kill -9 <process_id>
```

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf client/.vite
```

**Real-Time Features Not Working**
- Check browser console for Socket.io errors
- Verify Socket.io versions match (client and server)
- Ensure websocket connections are not blocked by firewall
- Test with different browsers

## 🔒 Security Features

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt (10 rounds)
- CORS protection with whitelist
- Rate limiting on API endpoints
- Helmet.js for security headers
- Input validation with express-validator
- XSS protection
- SQL injection prevention with Mongoose

## 🚀 Deployment

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

### MongoDB Atlas
1. Create cluster at mongodb.com/cloud/atlas
2. Create database user
3. Whitelist IP addresses
4. Get connection string
5. Update `MONGODB_URI` in `.env`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hitraj1601**
- GitHub: [@Hitraj1601](https://github.com/Hitraj1601)
- Repository: [bidding-web2](https://github.com/Hitraj1601/bidding-web2)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- Socket.io for real-time capabilities
- MongoDB for the flexible database
- Bootstrap team for the UI components
- Framer Motion for smooth animations

---

**Built with ❤️ by Hitraj1601**
