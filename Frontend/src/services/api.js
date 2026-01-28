import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.get('/users/logout'),
  getProfile: () => api.get('/users/profile'),
};

export const captainAuthAPI = {
  register: (data) => api.post('/captains/register', data),
  login: (data) => api.post('/captains/login', data),
  logout: () => api.get('/captains/logout'),
  getProfile: () => api.get('/captains/profile'),
};

// Maps APIs
export const mapsAPI = {
  getCoordinates: (address) =>
    api.get('/maps/get-coordinates', { params: { address } }),
  getDistanceTime: (origin, destination) =>
    api.get('/maps/get-distance-time', {
      params: {
        'origin.lat': origin.lat,
        'origin.lng': origin.lng,
        'destination.lat': destination.lat,
        'destination.lng': destination.lng,
      },
    }),
  getSuggestions: (input) =>
    api.get('/maps/get-suggestions', { params: { input } }),
};

// Rides APIs
export const ridesAPI = {
  createRide: (data) => api.post('/rides/create', data),
  getFare: (pickup, destination, vehicleType) =>
    api.get('/rides/get-fare', {
      params: { pickup, destination, vehicleType },
    }),
  acceptRide: (rideId) => api.post(`/rides/accept/${rideId}`),
  startRide: (rideId, otp) => api.post(`/rides/start/${rideId}`, { otp }),
  endRide: (rideId) => api.post(`/rides/end/${rideId}`),
  getRideById: (rideId) => api.get(`/rides/${rideId}`),
  getRides: () => api.get('/rides'),
};

export default api;
