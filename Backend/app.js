import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDb } from "./db/db.js";
import userRoutes from './routes/user.route.js'
import mapRoutes from './routes/maps.route.js'
import cookieParser from "cookie-parser";
import captainRoutes from './routes/captain.route.js';
import rideRoutes from './routes/ride.routes.js'

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});

dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true       
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Database connection
connectToDb();

// Store active users and captains with their socket IDs
const activeUsers = new Map();
const activeCaptains = new Map();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);

  // User joins
  socket.on('user-join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Captain joins
  socket.on('captain-join', (captainId) => {
    activeCaptains.set(captainId, socket.id);
    socket.join(`captain-${captainId}`);
    socket.join('captains-room'); // All captains join this room for ride broadcasts
    console.log(`Captain ${captainId} joined with socket ${socket.id}`);
  });

  // Captain updates location
  socket.on('captain-location-update', (data) => {
    const { captainId, location } = data;
    
    // Broadcast to all users (for live map)
    socket.broadcast.emit('captain-location', {
      captainId,
      location,
      timestamp: new Date()
    });
    
    // Also send to specific ride room if available
    if (data.rideId) {
      io.to(`ride-${data.rideId}`).emit('captain-location', {
        captainId,
        location,
        timestamp: new Date()
      });
    }
  });

  // User location update
  socket.on('user-location-update', (data) => {
    const { userId, location } = data;
    
    if (data.rideId) {
      io.to(`ride-${data.rideId}`).emit('user-location', {
        userId,
        location,
        timestamp: new Date()
      });
    }
  });

  // Ride events
  socket.on('ride-created', (rideData) => {
    const { rideId, userId } = rideData;
    
    // Join user to ride room
    io.to(`user-${userId}`).socketsJoin(`ride-${rideId}`);
    
    // Notify all captains about new ride
    io.to('captains-room').emit('new-ride', rideData);
    console.log('New ride created:', rideId);
  });

  socket.on('ride-accepted', (rideData) => {
    const { rideId, captainId, userId } = rideData;
    
    // Join captain to ride room
    io.to(`captain-${captainId}`).socketsJoin(`ride-${rideId}`);
    
    // Notify user that ride was accepted
    io.to(`ride-${rideId}`).emit('ride-accepted', {
      captainId,
      captainDetails: rideData.captainDetails
    });
    
    console.log('Ride accepted:', rideId);
  });

  socket.on('ride-started', (rideData) => {
    const { rideId } = rideData;
    
    io.to(`ride-${rideId}`).emit('ride-started', {
      timestamp: new Date(),
      ...rideData
    });
    
    console.log('Ride started:', rideId);
  });

  socket.on('ride-completed', (rideData) => {
    const { rideId } = rideData;
    
    io.to(`ride-${rideId}`).emit('ride-completed', rideData);
    io.socketsLeave(`ride-${rideId}`);
    
    console.log('Ride completed:', rideId);
  });

  // Disconnect
  socket.on('disconnect', () => {
    // Remove from active users/captains
    for (let [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    }

    for (let [captainId, socketId] of activeCaptains.entries()) {
      if (socketId === socket.id) {
        activeCaptains.delete(captainId);
        console.log(`Captain ${captainId} disconnected`);
      }
    }
  });
});

app.get('/',(req,res)=>{
    res.send('Hello Bro')
})

app.use('/users',userRoutes);
app.use('/captains',captainRoutes);
app.use('/maps',mapRoutes)
app.use('/rides',rideRoutes)

export { server, io };
export default app;