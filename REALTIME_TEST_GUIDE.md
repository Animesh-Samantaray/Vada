# Real-Time Features - Quick Test Guide

## Prerequisites
- Both servers running:
  ```bash
  # Terminal 1 - Backend
  cd Backend
  npm run dev
  
  # Terminal 2 - Frontend
  cd Frontend
  npm run dev
  ```

## Test Scenario 1: Live Ride Notifications ⚡

### Steps:
1. **Open Browser 1**: User side
   - Navigate to `http://localhost:5173`
   - Login as user
   - Go to Home page (Find a trip)

2. **Open Browser 2**: Captain side
   - Navigate to `http://localhost:5173`
   - Login as captain
   - Go to Captain Home page

3. **In Browser 1 - User**:
   - Enter pickup location: "Times Square"
   - Enter destination: "Central Park"
   - Select vehicle: UberX
   - Click "Confirm Ride"

4. **Expected Result in Browser 2**:
   - Captain should see **ride popup instantly** (not after 5 seconds)
   - No delay - this is real-time WebSocket!

### What You're Testing:
- ✅ Socket.io `ride-created` event emission
- ✅ Backend broadcasting to `captains-room`
- ✅ Captain receiving `new-ride` event
- ✅ UI updating without polling

---

## Test Scenario 2: Live Location Updates 📍

### Prerequisites:
- Have a ride accepted (from Scenario 1)

### Steps:
1. **Both sides should be on ride page**

2. **Check DevTools Console** (F12 → Console):
   ```javascript
   // Look for logs like:
   // "Captain location: {lat, lng}"
   // "User location: {lat, lng}"
   ```

3. **Observe Map Updates**:
   - User home page should show interactive map
   - Captain marker should move in real-time
   - Pickup/destination markers visible

### Expected Behavior:
- Locations update **continuously** as geolocation updates
- No "Loading..." delays between updates
- Map smoothly shows captain's position

### What You're Testing:
- ✅ Geolocation API integration
- ✅ Socket.io `captain-location-update` events
- ✅ LiveMap component marker updates
- ✅ Real-time positioning

---

## Test Scenario 3: Multiple Captains Reception 👥

### Setup:
1. **Open 3 Browser Windows**:
   - Window 1: User logged in
   - Window 2: Captain A logged in
   - Window 3: Captain B logged in
   - All on relevant home pages

### Steps:
1. User creates a ride (same as Scenario 1)
2. **Check simultaneously in Windows 2 and 3**

### Expected Result:
- **Both captains** receive the ride popup at the **same time**
- Neither waits for the other
- Both can accept simultaneously (first one wins)

### What You're Testing:
- ✅ Broadcasting to multiple sockets
- ✅ Room-based event distribution
- ✅ Socket.io concurrent handling

---

## Test Scenario 4: Map Display & Interactions 🗺️

### Steps:
1. Go to User Home page
2. Enter any location as pickup
3. Enter any location as destination

### Expected Results:
- ✅ Interactive map appears (not static image)
- ✅ Pickup location has **green marker**
- ✅ Destination has **red marker**
- ✅ Map is **zoomable** and **draggable**
- ✅ Color legend shown at bottom

### Optional Testing:
- Zoom in/out on map
- Pan the map around
- Watch captain location update live

### What You're Testing:
- ✅ Leaflet map integration
- ✅ Marker rendering and positioning
- ✅ Real-time marker updates
- ✅ Interactive map controls

---

## Test Scenario 5: Connection Status Check 🔗

### Steps:
1. **Open DevTools** (F12)
2. **Go to Network tab**
3. Filter by "WS" (WebSocket)
4. You should see:
   ```
   ws://localhost:5000/socket.io/
   ```

### Expected Results:
- ✅ WebSocket connection established (green/connected)
- ✅ Status shows "101 Switching Protocols"
- ✅ Connection persists (not closed)

### What You're Testing:
- ✅ Socket.io server is accepting connections
- ✅ WebSocket protocol is working
- ✅ Client is connected properly

---

## Console Logs to Look For

### In Browser DevTools Console:

**On Connection:**
```javascript
Socket connected: [socket-id]
User/Captain [id] joined with socket [socket-id]
```

**On New Ride:**
```javascript
New ride created: [ride-id]
Captain location: {lat: 40.7128, lng: -74.0060}
```

**On Ride Updates:**
```javascript
Ride accepted: [ride-id]
Ride started: [ride-id]
Ride completed: [ride-id]
```

---

## Backend Terminal Logs to Check

### Expected Server Output:

```
Server is running on port 5000
New socket connection: [socket-id-1]
User [user-id] joined with socket [socket-id-1]
User [user-id] disconnected

New socket connection: [socket-id-2]
Captain [captain-id] joined with socket [socket-id-2]
Captain [captain-id] joined with socket [socket-id-2]
New ride created: [ride-id]
Ride accepted: [ride-id]
Captain [captain-id] disconnected
```

---

## Comparison: Before vs After

### Before (HTTP Polling)
```
Captain opens dashboard
Polling starts (every 5 seconds)
User creates ride...
Wait 0-5 seconds...
Captain finally sees ride popup 😴
```

### After (WebSocket)
```
Captain opens dashboard
Socket connects (instant)
User creates ride...
Captain sees popup IMMEDIATELY ⚡
No waiting, no polling!
```

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Map not showing | Check `LiveMap.jsx` import in Home.jsx |
| No location updates | Enable geolocation permission in browser |
| Captain not getting rides | Check if `captainJoin()` called in useEffect |
| Socket not connecting | Verify `socketService.connect()` in useEffect |
| Errors in console | Check CORS in `Backend/app.js` |

---

## Success Checklist ✅

After testing, you should have:

- [ ] Live ride notifications (no 5-second delay)
- [ ] Interactive map on home page
- [ ] Real-time location markers
- [ ] Multiple captains receive rides simultaneously
- [ ] WebSocket connection in Network tab
- [ ] Console logs showing socket events
- [ ] No HTTP polling requests (all WebSocket)

**If all checked, your real-time features are working! 🎉**

---

## Next Steps

1. **Try the app flow**: Login → Search → Ride → Accept → Track
2. **Test with multiple users/captains simultaneously**
3. **Monitor console logs** to understand event flow
4. **Celebrate** - you've built real-time Uber! 🚗💨
