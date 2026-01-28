# 🎬 Real-Time System Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│                     Port: 5173 (Vite Dev)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Pages:                    Components:                           │
│  ┌──────────────┐         ┌──────────────────┐                 │
│  │ Home.jsx     │────────→│ LiveMap.jsx      │                 │
│  │ (User)       │         │ (Interactive Map)│                 │
│  ├──────────────┤         └──────────────────┘                 │
│  │ Captain      │         ┌──────────────────┐                 │
│  │ Home.jsx     │────────→│ RidePopup.jsx    │                 │
│  │ (Captain)    │         │ (Real-time)      │                 │
│  └──────────────┘         └──────────────────┘                 │
│         ↓                           ↓                            │
│   ┌──────────────────────────────────────────┐                 │
│   │  Socket Service (socket.js)              │                 │
│   │  ├─ userJoin()                           │                 │
│   │  ├─ captainJoin()                        │                 │
│   │  ├─ emitRideCreated()                    │                 │
│   │  ├─ onNewRide()                          │                 │
│   │  └─ emitUserLocationUpdate()             │                 │
│   └──────────────────────────────────────────┘                 │
│                           ↓↓↓ WebSocket ↓↓↓                    │
└─────────────────────────────────────────────────────────────────┘
                            ║
                 ⚡ WebSocket Connection ⚡
                            ║
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (Express)                         │
│                     Port: 5000 (Node.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Express App + Socket.io Server                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Socket.io Event Handlers                                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ user-join ──────────→ Join user-{userId}                │  │
│  │ captain-join ───────→ Join captain-{id} + captains-room │  │
│  │ ride-created ───────→ Broadcast to captains-room        │  │
│  │ ride-accepted ──────→ Emit to user-{userId}            │  │
│  │ location-update ───→ Broadcast to ride-{rideId}        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Rooms Structure:                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ user-{userId}        → Personal user notifications      │   │
│  │ captain-{captainId}  → Personal captain notifications   │   │
│  │ captains-room        → All captains (broadcast)         │   │
│  │ ride-{rideId}        → User + Captain (ride tracking)   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  REST API (for initial auth & data):                            │
│  ├─ POST /users/login                                           │
│  ├─ POST /captains/login                                        │
│  ├─ POST /rides/create                                          │
│  └─ GET  /rides/                                                │
│                                                                   │
│  Database (MongoDB):                                             │
│  ├─ users collection                                            │
│  ├─ captains collection                                         │
│  ├─ rides collection                                            │
│  └─ blacklist collection                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Event Flow Diagrams

### 1. Ride Creation Flow (Real-Time)

```
┌─────────────────────────────────────────────────────────────────┐
│ USER BROWSER: Home.jsx                                           │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ ConfrimedRide.jsx                                          │ │
│ │ User clicks "Confirm Ride"                                │ │
│ └─────────────────────┬──────────────────────────────────────┘ │
│                       ↓                                          │
│ REST API Call:  POST /rides/create                              │
│                       ↓                                          │
│ Get Ride ID back                                                │
│                       ↓                                          │
│ socketService.emitRideCreated({                                │
│   rideId, userId, pickup, destination, ...                     │
│ })                                                               │
│                       │                                          │
│                       │ WebSocket emit                           │
│                       ↓                                          │
└─────────────────────────────────────────────────────────────────┘
                        │
                        │
                ⚡ Over WebSocket ⚡
                        │
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND: app.js Socket.io                                        │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ socket.on('ride-created', (rideData) => {                │ │
│ │   // Save to database (optional)                           │ │
│ │   io.to('captains-room').emit('new-ride', rideData)      │ │
│ │ })                                                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                       ↓                                          │
│ Broadcast to ALL captains in 'captains-room'                    │
│                       │                                          │
│                       │ WebSocket broadcast                      │
│                       ↓                                          │
└─────────────────────────────────────────────────────────────────┘
                        │
                ⚡ All Captains Receive ⚡
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ CAPTAIN 1    │ │ CAPTAIN 2    │ │ CAPTAIN 3    │
│ Browser      │ │ Browser      │ │ Browser      │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ CaptainHome  │ │ CaptainHome  │ │ CaptainHome  │
│ .jsx         │ │ .jsx         │ │ .jsx         │
│              │ │              │ │              │
│ onNewRide    │ │ onNewRide    │ │ onNewRide    │
│ listener:    │ │ listener:    │ │ listener:    │
│ Show popup   │ │ Show popup   │ │ Show popup   │
└──────────────┘ └──────────────┘ └──────────────┘
   ⏱️ <100ms        ⏱️ <100ms        ⏱️ <100ms
```

**Key Point:** All captains notified **simultaneously** in <100ms!

---

### 2. Ride Acceptance Flow

```
┌─────────────────┐
│ CAPTAIN BROWSER │
│ CaptainHome     │
│ Clicks Accept   │
└────────┬────────┘
         │
         ↓
    REST API
    Accept Ride
         │
         ↓
   socket.on('ride-accepted')
   emits event
         │
         ↓
   ⚡ WebSocket ⚡
         │
         ↓
┌─────────────────┐
│ BACKEND         │
│ app.js          │
│ emit to         │
│ ride-{rideId}   │
│ room            │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ USER BROWSER    │
│ Home.jsx        │
│ onRideAccepted()│
│ Shows captain   │
│ details on map  │
└─────────────────┘

⏱️ Total latency: <100ms
```

---

### 3. Location Update Flow (Continuous)

```
CAPTAIN SIDE:
┌──────────────────────┐
│ Geolocation API      │
│ Position updated     │
└─────────┬────────────┘
          │
          ↓
┌──────────────────────┐
│ useEffect hook       │
│ watchPosition()      │
└─────────┬────────────┘
          │
          ↓
┌──────────────────────────────────┐
│ emitCaptainLocationUpdate(        │
│   captainId,                      │
│   {lat, lng},                     │
│   rideId                          │
│ )                                 │
└─────────┬────────────────────────┘
          │
     ⚡ WebSocket ⚡
          │
          ↓
┌──────────────────────────────────┐
│ BACKEND:                         │
│ socket.on('captain-location-    │
│   update')                       │
│ io.to(`ride-${rideId}`)         │
│   .emit('captain-location', ...) │
└─────────┬────────────────────────┘
          │
     ⚡ WebSocket ⚡
          │
          ↓
USER SIDE:
┌──────────────────────────────────┐
│ socketService.onCaptainLocation  │
│ Update((data) => {               │
│   setCaptainLocation(            │
│     data.location                │
│   )                              │
│ })                               │
└─────────┬────────────────────────┘
          │
          ↓
┌──────────────────────────────────┐
│ LiveMap component                │
│ Update captain marker position   │
│                                  │
│ 🔵 Captain marker moves on map  │
└──────────────────────────────────┘

⏱️ Frequency: Real-time (~100ms)
```

---

## WebSocket vs HTTP Polling Comparison

### HTTP Polling (Old Way)
```
Timeline:

0ms:   Captain: GET /rides
       ← Response: No rides
       Wait 5 seconds...

5000ms: Captain: GET /rides
        ← Response: No rides
        Wait 5 seconds...

10000ms: Captain: GET /rides
         ← Response: No rides
         Wait 5 seconds...

12000ms: USER CREATES RIDE (at backend)

15000ms: Captain: GET /rides
         ← Response: YES! Ride from 12000ms
         Captain sees notification 3 seconds late 😞

Total overhead:
- 3 requests wasted
- 15 second total latency
- High server load
```

### WebSocket (New Way)
```
Timeline:

0ms:  Captain connects
      socket.io connection established
      captain joins 'captains-room'

0ms:  Captain ready, listening for 'new-ride'

12000ms: User creates ride
         socketService.emitRideCreated()
         
12005ms: Backend receives, broadcasts to 'captains-room'

12050ms: Captain receives 'new-ride' event
         CaptainHome shows RidePopup
         
Total latency: 50ms! ⚡

No wasted requests
No polling overhead
Real-time delivery
```

---

## Room Structure & Isolation

```
┌─────────────────────────────────────────────────────┐
│ Socket.io Server (Backend)                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Room: 'user-user123'                               │
│ │ Members: User with ID user123                    │
│ │ Purpose: Personal notifications for this user    │
│ │                                                   │
│ └─ Can receive: ride-accepted, ride-started, etc  │
│                                                    │
│ Room: 'captain-cap456'                             │
│ │ Members: Captain with ID cap456                 │
│ │ Purpose: Personal notifications for this captain│
│ │                                                   │
│ └─ Can receive: ride-completed, etc               │
│                                                    │
│ Room: 'captains-room'                              │
│ │ Members: All active captains                    │
│ │ Purpose: Broadcast new rides                    │
│ │                                                   │
│ ├─ cap456 ─→ Receive: new-ride                    │
│ ├─ cap789 ─→ Receive: new-ride                    │
│ └─ cap999 ─→ Receive: new-ride                    │
│                                                    │
│ Room: 'ride-ride123'                               │
│ │ Members: User + Captain for this specific ride  │
│ │ Purpose: Real-time ride tracking                │
│ │                                                   │
│ ├─ user123 ────────→ Location updates            │
│ └─ cap456 ────────→ Location updates             │
│                                                    │
│ Security: Users cannot access other user rooms!   │
└─────────────────────────────────────────────────────┘
```

---

## Data Structure: What Gets Emitted

### ride-created event
```javascript
{
  rideId: "63f7d4c2e8a9b1c2d3e4f5g6",
  userId: "user123",
  pickup: "Times Square",
  destination: "Central Park",
  vehicleType: "UberX",
  fare: 250,
  status: "pending",
  timestamp: "2024-01-15T10:30:00Z"
}
```

### captain-location-update event
```javascript
{
  captainId: "cap456",
  location: {
    lat: 40.7128,
    lng: -74.0060
  },
  rideId: "ride123",
  timestamp: "2024-01-15T10:30:45Z"
}
```

### ride-accepted event
```javascript
{
  rideId: "ride123",
  captainId: "cap456",
  captainDetails: {
    name: "John Doe",
    vehicle: "Honda Civic",
    rating: 4.8,
    location: {
      lat: 40.7200,
      lng: -74.0100
    }
  }
}
```

---

## Scalability: How It Handles Load

### 100 Captains Online

```
Before (HTTP Polling):
- 100 captains
- Each polls every 5 seconds
- 20 requests/second to backend
- High CPU & memory usage

After (WebSocket):
- 100 captains
- 100 socket connections (persistent)
- Only events sent when needed
- Low CPU & memory usage
- Can handle 1000+ easily
```

---

## Map Component Architecture

```
┌────────────────────────────────────────┐
│ LiveMap.jsx (React Component)          │
├────────────────────────────────────────┤
│                                        │
│ State:                                 │
│ - pickupLocation                       │
│ - destinationLocation                  │
│ - userLocation                         │
│ - captainLocation                      │
│ - captains (map of all captains)       │
│                                        │
│ useEffect Hooks:                       │
│ 1. Initialize Leaflet map              │
│ 2. Update markers when locations change│
│ 3. Listen to Socket.io events          │
│                                        │
│ Map Layers:                            │
│ ├─ OpenStreetMap tile layer            │
│ └─ Markers:                            │
│    ├─ Pickup (green marker)            │
│    ├─ Destination (red marker)         │
│    ├─ User (gold marker)               │
│    └─ Captain (blue marker)            │
│                                        │
│ Interactions:                          │
│ ├─ Zoom in/out                         │
│ ├─ Pan/drag map                        │
│ ├─ Auto-fit to bounds                  │
│ └─ Real-time marker updates            │
│                                        │
│ External Data:                         │
│ └─ Socket.io events:                   │
│    onCaptainLocationUpdate → Update    │
│    onRideStarted → Highlight route     │
│                                        │
└────────────────────────────────────────┘
```

---

## Authentication & Security Flow

```
┌─────────────────────────────────────────────┐
│ User/Captain Login                          │
├─────────────────────────────────────────────┤
│                                              │
│ REST API: POST /users/login                 │
│ or POST /captains/login                     │
│                                              │
│           ↓                                  │
│                                              │
│ Response: {token: "jwt_token", ...}         │
│           ↓                                  │
│           Save to localStorage              │
│           ↓                                  │
│                                              │
│ Frontend creates Socket.io connection       │
│                                              │
│ axios.defaults.headers.common[              │
│   'Authorization'                           │
│ ] = `Bearer ${token}`                       │
│                                              │
│           ↓                                  │
│                                              │
│ Socket.io handshake includes headers        │
│ Backend validates token from headers        │
│                                              │
│ socket.on('user-join', (userId) => {       │
│   // Verify token matches userId           │
│   if (validateToken(userId, token)) {      │
│     socket.join(`user-${userId}`)          │
│   }                                         │
│ })                                          │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Summary: Before vs After

```
┌──────────────────────┬──────────────────────┐
│ BEFORE (Polling)     │ AFTER (WebSocket)    │
├──────────────────────┼──────────────────────┤
│ ❌ 5s delay          │ ✅ <100ms delay      │
│ ❌ Static map        │ ✅ Live interactive  │
│ ❌ Polling every 5s  │ ✅ Event-based       │
│ ❌ High traffic      │ ✅ Minimal traffic   │
│ ❌ 100s users limit  │ ✅ 1000s users      │
│ ❌ Inefficient       │ ✅ Production-ready  │
│                      │                      │
│ Tech: HTTP polling   │ Tech: WebSocket      │
│ Latency: 5000ms      │ Latency: <100ms      │
│ Bandwidth: High      │ Bandwidth: Low       │
│ Scalability: Poor    │ Scalability: Excellent│
└──────────────────────┴──────────────────────┘
```

---

**That's your complete real-time Uber architecture!** 🚀
