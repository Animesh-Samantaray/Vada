# 🚗 Uber Clone - MERN Stack with Real-Time Geolocation

A full-stack MERN (MongoDB, Express, React, Node.js) Uber clone with real-time GPS tracking, live mapping, and Socket.io powered communication.

## 🌟 Features

### Core Features
- ✅ **User Authentication** - Register, login, logout with JWT tokens
- ✅ **Captain Authentication** - Separate captain registration and login
- ✅ **Real-Time Geolocation** - Live GPS tracking (no demo data)
- ✅ **Live Mapping** - Interactive Leaflet maps with real-time markers
- ✅ **Ride Creation** - Users can request rides with location-based fares
- ✅ **Vehicle Selection** - Choose between Auto, Car, and Bike
- ✅ **Fare Calculation** - Dynamic fare based on distance and time
- ✅ **Captain Location Tracking** - Real-time captain position on user's map
- ✅ **Socket.io Real-Time** - Instant ride acceptance, location updates
- ✅ **Protected Routes** - User and Captain dashboards with auth protection

### Technical Features
- 🔐 Password hashing with bcryptjs
- 🔒 JWT authentication with secure tokens
- 📍 Real-time geolocation with high accuracy
- 🗺️ OpenStreetMap integration with Leaflet
- 💬 WebSocket communication via Socket.io
- 🏎️ Fast HMR (Hot Module Reload) with Vite
- 📱 Responsive UI with Tailwind CSS
- ✨ Smooth animations with GSAP
- 🔄 Axios interceptors for auth headers

---

## 🛠 Tech Stack

### Frontend
- **React** (Vite) - UI library
- **Tailwind CSS** - Styling
- **Leaflet + React-Leaflet** - Interactive mapping
- **Socket.io-client** - Real-time communication
- **GSAP** - Animations
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js + Express** - Server framework
- **MongoDB + Mongoose** - Database
- **Socket.io** - Real-time server
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nominatim (OpenStreetMap)** - Geocoding service
- **Nodemon** - Development auto-reload

---

## 📦 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Modern browser** (Chrome, Firefox, Safari, Edge)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/uber-clone.git
cd uber-clone
```

### 2. Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/uber
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
EOF

# Start backend server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000
EOF

# Start frontend dev server
npm run dev
# App runs on http://localhost:5173
```

---

## 🚀 Running the Project

### Development Mode

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
# Output: Server is running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
# Output: ➜  Local:   http://localhost:5173/
```

### Access the Application
- **User App**: http://localhost:5173
- **API Server**: http://localhost:5000
- **Socket.io**: ws://localhost:5000

---

## 📁 Project Structure

```
uber-clone/
├── Backend/
│   ├── controllers/          # Request handlers
│   │   ├── user.controller.js
│   │   ├── captain.controller.js
│   │   ├── ride.controller.js
│   │   └── maps.controller.js
│   ├── models/               # Database schemas
│   │   ├── user.model.js
│   │   ├── captain.model.js
│   │   ├── ride.model.js
│   │   └── blacklistToken.model.js
│   ├── routes/               # API endpoints
│   │   ├── user.route.js
│   │   ├── captain.route.js
│   │   ├── ride.route.js
│   │   └── maps.route.js
│   ├── services/             # Business logic
│   │   ├── user.service.js
│   │   ├── captain.service.js
│   │   ├── ride.service.js
│   │   └── maps.service.js
│   ├── middlewares/          # Auth, validators
│   │   └── auth.middleware.js
│   ├── db/
│   │   └── db.js             # MongoDB connection
│   ├── app.js                # Express app + Socket.io
│   ├── server.js             # Server entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── LiveMap.jsx
│   │   │   ├── VehiclePanel.jsx
│   │   │   ├── ConfrimedRide.jsx
│   │   │   ├── LocationSearchPanel.jsx
│   │   │   ├── CaptainDetails.jsx
│   │   │   ├── RidePopUp.jsx
│   │   │   └── ...
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── CaptainHome.jsx
│   │   │   ├── UserLogin.jsx
│   │   │   ├── UserSignup.jsx
│   │   │   ├── CaptainLogin.jsx
│   │   │   ├── CaptainSignup.jsx
│   │   │   └── ...
│   │   ├── context/          # React context
│   │   │   ├── UserContext.jsx
│   │   │   └── CaptainContext.jsx
│   │   ├── services/         # API & utilities
│   │   │   ├── api.js
│   │   │   ├── socket.js
│   │   │   └── geolocation.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/               # Static assets
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register new user |
| POST | `/users/login` | User login |
| GET | `/users/logout` | User logout |
| GET | `/users/profile` | Get user profile |
| POST | `/captains/register` | Register new captain |
| POST | `/captains/login` | Captain login |
| GET | `/captains/logout` | Captain logout |
| GET | `/captains/profile` | Get captain profile |

### Maps
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/maps/get-coordinates` | Get coordinates from address |
| GET | `/maps/get-suggestions` | Get address suggestions |
| GET | `/maps/get-distance-time` | Get distance & time between two points |

### Rides
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/rides/create` | Create a new ride request |
| GET | `/rides/get-fare` | Calculate fare for route |
| POST | `/rides/accept/:rideId` | Captain accepts ride |
| POST | `/rides/start/:rideId` | Captain starts ride |
| POST | `/rides/end/:rideId` | Captain ends ride |
| GET | `/rides` | Get all available rides (captain) |
| GET | `/rides/:rideId` | Get ride details |

---

## 🔄 Real-Time Features (Socket.io)

### Events

#### User Events
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `user-join` | User → Server | `userId` | User joins the app |
| `user-location-update` | User → Server | `{ userId, location }` | User sends location |
| `user-location` | Server → All | `{ userId, location }` | User location broadcast |
| `ride-created` | User → Server | `{ rideId, pickup, destination }` | Ride request sent |
| `ride-accepted` | Server → User | `{ rideId, captain }` | Captain accepted ride |

#### Captain Events
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `captain-join` | Captain → Server | `captainId` | Captain comes online |
| `captain-location-update` | Captain → Server | `{ captainId, location }` | Captain sends location |
| `captain-location` | Server → All | `{ captainId, location }` | Captain location broadcast |
| `new-ride` | Server → All Captains | `{ rideData }` | New ride available |

---

## 🗺️ Real-Time Geolocation

### How It Works
1. **Device GPS** → Gets real coordinates via browser geolocation API
2. **High Accuracy Mode** → Uses GPS for ±5-15m accuracy
3. **Continuous Tracking** → Updates every 2-5 seconds when moving
4. **Socket.io Emit** → Sends location to backend
5. **Broadcast** → Backend broadcasts to all users in ride
6. **Live Map** → Leaflet updates markers in real-time

### No Demo Data
- ✅ Real GPS coordinates only
- ✅ No hardcoded locations
- ✅ Dynamic based on device position
- ✅ Accuracy information included
- ✅ Speed and heading tracked

### Enable Location in Browser
1. Open http://localhost:5173
2. Browser will ask: "Allow location access?"
3. Click **Allow**
4. Watch console for: `🎯 Real location acquired: { lat: XX.XX, lng: XX.XX }`

---

## 🚗 User Flow

### User Journey
```
1. Register → 2. Login → 3. Home Page
4. Enter Pickup & Destination
5. See Live Map with Your Location
6. Vehicle Selection (Auto/Car/Bike)
7. Confirm Ride
8. Wait for Captain
9. See Captain Location on Map
10. Ride Updates (Started/Completed)
```

### Captain Flow
```
1. Register → 2. Login → 3. Captain Home
4. Camera Icon → Start Location Sharing
5. Get Real-Time New Ride Notifications
6. Accept Ride
7. See User Location on Map
8. Navigate to Pickup
9. Start Ride (with OTP)
10. Complete Ride
```

---

## 🔐 Authentication

### JWT Token Flow
```
1. User/Captain provides credentials
2. Backend validates and hashes password
3. JWT token generated
4. Token stored in localStorage
5. Token sent in Authorization header for every request
6. Token expires after configured time
7. Refresh or re-login required
```

### Protected Routes
- User pages require valid user JWT
- Captain pages require valid captain JWT
- Routes auto-redirect to login if not authenticated

---

## ⚙️ Configuration

### Backend Environment Variables
```env
# .env file in Backend/
MONGO_URI=mongodb://localhost:27017/uber
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

### Frontend Environment Variables
```env
# .env file in Frontend/
VITE_API_URL=http://localhost:5000
```

### Socket.io Configuration
```javascript
// Backend - cors for development
cors: {
  origin: 'http://localhost:5173',
  credentials: true
}
```

---

## 📊 Database Models

### User Schema
```javascript
{
  email: String (unique),
  password: String (hashed),
  fullname: {
    firstName: String,
    lastName: String
  },
  socketId: String,
  createdAt: Date
}
```

### Captain Schema
```javascript
{
  email: String (unique),
  password: String (hashed),
  fullname: {
    firstName: String,
    lastName: String
  },
  vehicle: {
    color: String,
    plate: String,
    capacity: Number,
    vehicleType: String (auto|car|moto)
  },
  location: {
    lat: Number,
    lng: Number
  },
  socketId: String,
  createdAt: Date
}
```

### Ride Schema
```javascript
{
  user: ObjectId (ref: User),
  captain: ObjectId (ref: Captain),
  pickup: String,
  destination: String,
  fare: Number,
  status: String (pending|accepted|started|completed|cancelled),
  otp: String,
  distance: Number,
  duration: Number,
  createdAt: Date,
  completedAt: Date
}
```

---

## 🐛 Troubleshooting

### "Port 5000 already in use"
```bash
# Kill process using port 5000
# Windows:
taskkill /F /FI "CommandLine=*node*"

# Mac/Linux:
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### "Geolocation not available"
- Ensure HTTPS (required for geolocation)
- Check browser location permissions
- Verify GPS/Location services enabled on device
- Grant permission in browser settings

### "API returns 400 Bad Request"
- Check backend console for errors
- Verify MongoDB connection
- Ensure auth token in headers
- Check request body format matches validation

### "Socket connection fails"
- Verify backend is running on port 5000
- Check Socket.io CORS configuration
- Browser devtools → Network → WS (WebSocket)
- See if WebSocket connection established

### "Map not showing location"
- Refresh browser page
- Allow location permission again
- Check geolocation service enabled
- Verify LiveMap component receives location props

---

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
```bash
# Ensure Procfile exists
web: node server.js

# Push to platform
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy dist folder
# Update VITE_API_URL to production backend
```

### Production Checklist
- [ ] HTTPS enabled (geolocation requires it)
- [ ] MongoDB Atlas connection configured
- [ ] JWT_SECRET changed to strong random string
- [ ] Socket.io CORS updated to production domain
- [ ] API rate limiting enabled
- [ ] Error logging configured
- [ ] Environment variables secured

---

## 📚 Documentation Files

- [REALTIME_GEOLOCATION_SETUP.md](REALTIME_GEOLOCATION_SETUP.md) - Detailed geolocation guide
- [GEOLOCATION_TESTING.md](GEOLOCATION_TESTING.md) - Testing procedures
- [QUICK_START.md](QUICK_START.md) - Quick reference guide
- [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) - Feature details

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Ride history and receipts
- [ ] User ratings and reviews
- [ ] Saved locations (Home/Work)
- [ ] Ride sharing (pool rides)
- [ ] Emergency contacts

### Phase 3
- [ ] Real routing algorithms (OSRM)
- [ ] Traffic-aware ETA calculation
- [ ] Driver availability zones
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Notifications (Email/SMS)

### Phase 4
- [ ] Mobile app (React Native)
- [ ] Web push notifications
- [ ] AI-based pricing surge
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Performance optimization

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support & Contact

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@uberclone.local
- Discord: [Join Community](https://discord.gg/uberclone)

---

## 🎯 Project Status

- ✅ User & Captain Authentication
- ✅ Real-Time Geolocation
- ✅ Live Mapping with Markers
- ✅ Ride Creation & Acceptance
- ✅ Fare Calculation
- ✅ Socket.io Real-Time Communication
- 🔄 Payment Integration (In Progress)
- ⏳ Rating System (Planned)
- ⏳ Mobile App (Planned)

---

## 🙏 Acknowledgments

- OpenStreetMap & Nominatim for free geocoding
- Leaflet for mapping
- Socket.io for real-time communication
- Vite for fast development
- MERN community for best practices

---

**Built with ❤️ using MERN Stack**

Last Updated: January 28, 2026
