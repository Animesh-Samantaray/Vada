# MERN Uber Integration Guide

## Overview
Complete integration between frontend and backend for rides, mappings, and authentication.

## Backend Changes

### 1. Maps Routes (`/rides/maps.route.js`)
- Fixed `getDistanceTime` endpoint to use GET with query parameters instead of POST
- Updated validation to use `query()` instead of `body()`

### 2. Rides Controller & Routes (`/rides/routes` and `/rides/controllers`)
- Added `getFareController` - GET endpoint to calculate fares
- Added `acceptRide` - POST endpoint for captains to accept rides
- Added `startRide` - POST endpoint to start ride with OTP verification
- Added `endRide` - POST endpoint to complete ride
- Added `getAllRides` - GET endpoint to fetch pending rides
- Added `getCaptainRides` - GET endpoint for captain-specific rides
- Added `getRideById` - GET endpoint to fetch specific ride details

### 3. New Routes
- `GET /rides/get-fare` - Fetch fare for given pickup, destination, and vehicle type
- `GET /rides/` - Get all pending rides (for captains)
- `POST /rides/accept/:rideId` - Accept a ride
- `POST /rides/start/:rideId` - Start ride with OTP
- `POST /rides/end/:rideId` - End/complete ride
- `GET /rides/:rideId` - Get ride details

## Frontend Changes

### 1. API Service (`src/services/api.js`)
- Centralized axios instance with automatic token injection
- Organized API endpoints into categories:
  - `authAPI` - User authentication
  - `captainAuthAPI` - Captain authentication
  - `mapsAPI` - Maps services
  - `ridesAPI` - Rides operations

### 2. Components Updated

#### LocationSearchPanel
- Integrated with `mapsAPI.getSuggestions()`
- Real-time location search as user types
- Dynamic activation for pickup/destination fields

#### VehiclePanel
- Dynamically fetches fares for auto, car, and bike
- Displays real-time pricing based on pickup/destination
- Passes selected vehicle type and fare to confirmation

#### ConfrimedRide
- Calls `ridesAPI.createRide()` to create ride
- Displays pickup, destination, vehicle type, and fare
- Error handling for ride creation failures

#### RidePopUp (Captain)
- Displays actual ride data from backend
- Shows user details, pickup, destination, and fare
- Calls `ridesAPI.acceptRide()` to accept ride

#### ConfirmRidePopUp (Captain)
- Validates 6-digit OTP
- Calls `ridesAPI.startRide()` with OTP
- Navigates to captain-riding page on success

#### CaptainHome
- Fetches pending rides every 5 seconds
- Auto-displays first available ride
- Real-time ride polling for live updates

### 3. Home Page
- Added state for selected vehicle and fare
- Passes ride data to all child components
- Manages ride lifecycle UI transitions

## Data Flow

### User Books Ride
1. User enters pickup location → API suggestions loaded
2. User enters destination → API suggestions loaded
3. System calculates fare for selected vehicle type
4. User confirms ride → `createRide` API called
5. Ride created with status: 'pending'

### Captain Accepts Ride
1. Captain views available rides (polling every 5s)
2. Captain accepts ride → `acceptRide` API called
3. Ride status changes to 'accepted'
4. Captain enters OTP → `startRide` API called
5. OTP validated, ride status changes to 'ongoing'

## Environment Setup

### Frontend .env
```
VITE_API_URL=http://localhost:5000
```

### Backend .env
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
MAPS_API_KEY=your_google_maps_key
PORT=5000
```

## API Authentication
- User & Captain tokens stored in localStorage
- Automatically injected in all API requests via axios interceptor
- Cookie-based authentication also supported

## Ride Status Flow
- **pending** → Ride created, waiting for captain
- **accepted** → Captain accepted, waiting for OTP entry
- **ongoing** → Ride started, in progress
- **completed** → Ride finished
- **cancelled** → Ride cancelled

## Key Features
✅ Location search with autocomplete
✅ Dynamic fare calculation
✅ Real-time ride availability for captains
✅ OTP verification for ride start
✅ User and Captain authentication
✅ Ride lifecycle management
✅ Error handling and loading states

## Files Modified
- Backend: 
  - `controllers/ride.controller.js`
  - `controllers/maps.controller.js`
  - `routes/ride.routes.js`
  - `routes/maps.route.js`
- Frontend:
  - `src/services/api.js` (NEW)
  - `src/pages/Home.jsx`
  - `src/pages/CaptainHome.jsx`
  - `src/components/LocationSearchPanel.jsx`
  - `src/components/VehiclePanel.jsx`
  - `src/components/ConfrimedRide.jsx`
  - `src/components/RidePopUp.jsx`
  - `src/components/ConfirmRidePopUp.jsx`
