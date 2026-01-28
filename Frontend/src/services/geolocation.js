/**
 * Geolocation Service
 * Provides real, continuous, high-accuracy location tracking like Uber
 * No demo data, no hardcoding - only real GPS coordinates
 */

class GeolocationService {
  constructor() {
    this.watchId = null;
    this.isTracking = false;
    this.lastLocation = null;
    this.listeners = [];
  }

  /**
   * Check if geolocation is supported
   */
  isSupported() {
    return 'geolocation' in navigator;
  }

  /**
   * Get initial position with timeout and high accuracy
   * @returns {Promise} resolves with { lat, lng } or rejects on error
   */
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          this.lastLocation = location;
          console.log('🎯 Real location acquired:', location);
          resolve(location);
        },
        (error) => {
          console.error('❌ Geolocation error:', error.message);
          reject(new Error(`Geolocation failed: ${error.message}`));
        },
        {
          enableHighAccuracy: true, // Use GPS if available
          timeout: 15000, // Wait max 15 seconds
          maximumAge: 0, // Always get fresh data
        }
      );
    });
  }

  /**
   * Start continuous location tracking (like Uber live mode)
   * @param {Function} onLocationUpdate - callback(location)
   * @param {Function} onError - callback(error)
   */
  startTracking(onLocationUpdate, onError) {
    if (!this.isSupported()) {
      const error = new Error('Geolocation not supported');
      console.error(error);
      onError?.(error);
      return;
    }

    if (this.isTracking) {
      console.warn('⚠️ Tracking already active');
      return;
    }

    this.isTracking = true;
    console.log('🚀 Starting real-time location tracking...');

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        };

        // Only update if location actually changed (to reduce noise)
        if (!this.lastLocation || this.hasSignificantChange(this.lastLocation, location)) {
          this.lastLocation = location;
          console.log('📍 Location updated:', {
            lat: location.lat.toFixed(6),
            lng: location.lng.toFixed(6),
            accuracy: `±${location.accuracy.toFixed(0)}m`,
          });
          onLocationUpdate(location);
        }
      },
      (error) => {
        console.error('❌ Tracking error:', error.message);
        onError?.(error);
      },
      {
        enableHighAccuracy: true, // Use GPS
        timeout: 10000, // Timeout after 10 seconds
        maximumAge: 5000, // Cache for max 5 seconds to balance accuracy/battery
      }
    );
  }

  /**
   * Check if location change is significant (> 10 meters)
   * Helps reduce excessive socket emissions
   */
  hasSignificantChange(prev, curr) {
    if (!prev) return true;

    // Simple distance calculation (Haversine would be more accurate)
    const lat = curr.lat - prev.lat;
    const lng = curr.lng - prev.lng;
    const distance = Math.sqrt(lat * lat + lng * lng) * 111000; // approx meters

    return distance > 10; // Only report if moved > 10 meters
  }

  /**
   * Stop continuous tracking
   */
  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isTracking = false;
      console.log('⛔ Tracking stopped');
    }
  }

  /**
   * Get last known location
   */
  getLastLocation() {
    return this.lastLocation;
  }

  /**
   * Check if tracking is active
   */
  isTrackingActive() {
    return this.isTracking;
  }
}

export default new GeolocationService();
