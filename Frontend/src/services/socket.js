import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.connected) return;

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
    }
  }

  // User events
  userJoin(userId) {
    if (this.socket) {
      this.socket.emit('user-join', userId);
    }
  }

  emitUserLocationUpdate(userId, location, rideId = null) {
    if (this.socket) {
      this.socket.emit('user-location-update', {
        userId,
        location,
        rideId,
        timestamp: new Date()
      });
    }
  }

  // Captain events
  captainJoin(captainId) {
    if (this.socket) {
      this.socket.emit('captain-join', captainId);
    }
  }

  emitCaptainLocationUpdate(captainId, location, rideId = null) {
    if (this.socket) {
      this.socket.emit('captain-location-update', {
        captainId,
        location,
        rideId,
        timestamp: new Date()
      });
    }
  }

  // Ride events
  emitRideCreated(rideData) {
    if (this.socket) {
      this.socket.emit('ride-created', rideData);
    }
  }

  emitRideAccepted(rideData) {
    if (this.socket) {
      this.socket.emit('ride-accepted', rideData);
    }
  }

  emitRideStarted(rideData) {
    if (this.socket) {
      this.socket.emit('ride-started', rideData);
    }
  }

  emitRideCompleted(rideData) {
    if (this.socket) {
      this.socket.emit('ride-completed', rideData);
    }
  }

  // Listeners
  onNewRide(callback) {
    if (this.socket) {
      this.socket.on('new-ride', callback);
    }
  }

  onRideAccepted(callback) {
    if (this.socket) {
      this.socket.on('ride-accepted', callback);
    }
  }

  onRideStarted(callback) {
    if (this.socket) {
      this.socket.on('ride-started', callback);
    }
  }

  onRideCompleted(callback) {
    if (this.socket) {
      this.socket.on('ride-completed', callback);
    }
  }

  onCaptainLocationUpdate(callback) {
    if (this.socket) {
      this.socket.on('captain-location', callback);
    }
  }

  onUserLocationUpdate(callback) {
    if (this.socket) {
      this.socket.on('user-location', callback);
    }
  }

  // Remove listener
  offListener(eventName) {
    if (this.socket) {
      this.socket.off(eventName);
    }
  }
}

export default new SocketService();
