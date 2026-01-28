# Testing Guide - Uber MERN App Integration

## Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- MongoDB connected
- User and Captain accounts created

## User Flow Testing

### 1. User Login & Book Ride

#### Step 1: Login User
```bash
curl -X POST http://localhost:5000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```
**Expected Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```
Save the `token` in localStorage.

#### Step 2: Get Fare Estimate
```bash
curl -X GET "http://localhost:5000/rides/get-fare?pickup=Central%20Station&destination=Airport&vehicleType=car" \
  -H "Authorization: Bearer {TOKEN}"
```
**Expected Response:**
```json
{
  "fare": 250,
  "all_fares": {
    "auto": 180,
    "car": 250,
    "moto": 120
  }
}
```

#### Step 3: Create Ride
```bash
curl -X POST http://localhost:5000/rides/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "pickup": "Central Station",
    "destination": "Airport",
    "vehicleType": "car"
  }'
```
**Expected Response:**
```json
{
  "_id": "ride_id",
  "user": "user_id",
  "pickup": "Central Station",
  "destination": "Airport",
  "fare": 250,
  "status": "pending",
  "otp": "123456"
}
```
Save the ride `_id` for captain operations.

---

### 2. Captain Flow - Accept & Start Ride

#### Step 1: Captain Login
```bash
curl -X POST http://localhost:5000/captains/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "captain@example.com",
    "password": "password123"
  }'
```
**Expected Response:** Similar to user login with captain token.

#### Step 2: Get All Pending Rides
```bash
curl -X GET http://localhost:5000/rides/ \
  -H "Authorization: Bearer {CAPTAIN_TOKEN}"
```
**Expected Response:**
```json
[
  {
    "_id": "ride_id",
    "user": { "fullname": { "firstName": "John", "lastName": "Doe" } },
    "pickup": "Central Station",
    "destination": "Airport",
    "fare": 250,
    "status": "pending"
  }
]
```

#### Step 3: Accept Ride
```bash
curl -X POST http://localhost:5000/rides/accept/{RIDE_ID} \
  -H "Authorization: Bearer {CAPTAIN_TOKEN}"
```
**Expected Response:**
```json
{
  "_id": "ride_id",
  "user": { ... },
  "captain": "captain_id",
  "pickup": "Central Station",
  "destination": "Airport",
  "fare": 250,
  "status": "accepted"
}
```

#### Step 4: Start Ride (with OTP)
```bash
curl -X POST http://localhost:5000/rides/start/{RIDE_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {CAPTAIN_TOKEN}" \
  -d '{
    "otp": "123456"
  }'
```
**Expected Response:**
```json
{
  "_id": "ride_id",
  "status": "ongoing",
  "captain": { ... },
  "user": { ... }
}
```

#### Step 5: End Ride
```bash
curl -X POST http://localhost:5000/rides/end/{RIDE_ID} \
  -H "Authorization: Bearer {CAPTAIN_TOKEN}"
```
**Expected Response:**
```json
{
  "_id": "ride_id",
  "status": "completed"
}
```

---

## Maps API Testing

### Get Address Suggestions
```bash
curl -X GET "http://localhost:5000/maps/get-suggestions?input=Central" \
  -H "Authorization: Bearer {TOKEN}"
```

### Get Distance & Time
```bash
curl -X GET "http://localhost:5000/maps/get-distance-time?origin.lat=28.7041&origin.lng=77.1025&destination.lat=28.5355&destination.lng=77.3910" \
  -H "Authorization: Bearer {TOKEN}"
```

---

## Frontend Testing Checklist

### ✅ User Side
- [ ] Location search shows suggestions as user types
- [ ] Destination search shows suggestions
- [ ] Fare is calculated correctly for selected vehicle
- [ ] Ride confirmation shows all details (pickup, destination, fare, vehicle)
- [ ] After booking, "Looking for Driver" panel appears
- [ ] After driver accepts, "Waiting for Driver" panel appears

### ✅ Captain Side
- [ ] Captain home loads available rides (refreshes every 5 seconds)
- [ ] Ride popup shows correct user info, pickup, destination, and fare
- [ ] Accept button submits ride acceptance
- [ ] Confirm ride panel shows with OTP input field
- [ ] 6-digit OTP entry works correctly
- [ ] Navigates to captain-riding page after OTP verification
- [ ] Invalid OTP shows error message

---

## Common Issues & Solutions

### Issue: "Invalid OTP" error
**Solution:** Make sure you're using the exact OTP that was generated in the ride creation response.

### Issue: Ride not appearing for captain
**Solution:** 
- Ensure captain is logged in with valid token
- Check ride status is 'pending' in database
- Verify captain has correct authentication

### Issue: LocationSearchPanel not showing suggestions
**Solution:**
- Verify Maps API key is configured in backend
- Check maps service is working: test `/maps/get-suggestions`
- Ensure `activeField` prop is passed correctly

### Issue: "Unauthorized" on captain endpoints
**Solution:**
- Use captain token (from captain login)
- Not regular user token
- Ensure bearer token format: `Bearer {TOKEN}`

---

## API Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/register` | - | Register new user |
| POST | `/users/login` | - | Login user |
| GET | `/users/profile` | User | Get user profile |
| GET | `/users/logout` | User | Logout user |
| POST | `/captains/register` | - | Register new captain |
| POST | `/captains/login` | - | Login captain |
| GET | `/captains/profile` | Captain | Get captain profile |
| GET | `/captains/logout` | Captain | Logout captain |
| GET | `/maps/get-suggestions` | User | Get location suggestions |
| GET | `/maps/get-distance-time` | User | Get distance & time |
| POST | `/rides/create` | User | Create new ride |
| GET | `/rides/get-fare` | User | Calculate fare |
| GET | `/rides/` | Captain | Get all pending rides |
| POST | `/rides/accept/:rideId` | Captain | Accept ride |
| POST | `/rides/start/:rideId` | Captain | Start ride with OTP |
| POST | `/rides/end/:rideId` | Captain | End ride |
| GET | `/rides/:rideId` | User | Get ride details |

---

## Integration Verification

Run these checks to verify full integration:

1. **Backend API Check:**
   ```bash
   curl http://localhost:5000/
   # Should return: "Hello Bro"
   ```

2. **CORS Check:**
   - Frontend requests should include credentials
   - Cookies/tokens should be sent automatically

3. **Database Check:**
   - User collection should have created user
   - Captain collection should have created captain
   - Ride collection should have created ride with pending status

---

## Performance Notes

- Captain home polls for rides every 5 seconds
- This can be optimized with WebSockets for real-time updates
- Consider implementing:
  - Socket.io for live ride notifications
  - Real-time location tracking
  - Live captain location updates
  
---

## Security Considerations

- ✅ Tokens stored in localStorage
- ✅ Tokens sent in Authorization header
- ✅ OTP validation before ride start
- ⚠️ Consider: Token refresh mechanism
- ⚠️ Consider: Rate limiting on API endpoints
- ⚠️ Consider: HTTPS in production

