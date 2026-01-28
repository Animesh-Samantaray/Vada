import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import socketService from '../services/socket';

const LiveMap = ({ 
  pickupLocation, 
  destinationLocation, 
  captainLocation = null,
  userLocation = null,
  rideId = null 
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const pickupMarker = useRef(null);
  const destMarker = useRef(null);
  const captainMarker = useRef(null);
  const userMarker = useRef(null);
  const [captains, setCaptains] = useState({});
  const [route, setRoute] = useState(null);
  const polyline = useRef(null);

  // Custom icons
  const pickupIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const destIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const captainIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Initialize map - ONLY with real user location, no demo data
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Center ONLY on real user location - no fallback demo coords
    if (!userLocation) {
      console.warn('⏳ Waiting for real user location...');
      return;
    }

    const center = [userLocation.lat, userLocation.lng];

    map.current = L.map(mapContainer.current).setView(center, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add markers
    if (pickupLocation) {
      pickupMarker.current = L.marker([pickupLocation.lat, pickupLocation.lng], { icon: pickupIcon })
        .bindPopup('Pickup Location')
        .addTo(map.current);
    }

    if (destinationLocation) {
      destMarker.current = L.marker([destinationLocation.lat, destinationLocation.lng], { icon: destIcon })
        .bindPopup('Destination')
        .addTo(map.current);
    }

    if (userLocation) {
      userMarker.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindPopup('Your Location')
        .addTo(map.current);
    }

    if (captainLocation) {
      captainMarker.current = L.marker([captainLocation.lat, captainLocation.lng], { icon: captainIcon })
        .bindPopup('Captain Location')
        .addTo(map.current);
    }

    // Fit bounds if both pickup and destination exist
    if (pickupLocation && destinationLocation) {
      const group = new L.featureGroup([
        L.marker([pickupLocation.lat, pickupLocation.lng]),
        L.marker([destinationLocation.lat, destinationLocation.lng])
      ]);
      map.current.fitBounds(group.getBounds().pad(0.1));
    }

    return () => {
      // Don't destroy map on unmount
    };
  }, [userLocation]);

  // Update pickup marker
  useEffect(() => {
    if (map.current && pickupLocation) {
      if (pickupMarker.current) {
        pickupMarker.current.setLatLng([pickupLocation.lat, pickupLocation.lng]);
      } else {
        pickupMarker.current = L.marker([pickupLocation.lat, pickupLocation.lng], { icon: pickupIcon })
          .bindPopup('Pickup Location')
          .addTo(map.current);
      }
    }
  }, [pickupLocation]);

  // Update destination marker
  useEffect(() => {
    if (map.current && destinationLocation) {
      if (destMarker.current) {
        destMarker.current.setLatLng([destinationLocation.lat, destinationLocation.lng]);
      } else {
        destMarker.current = L.marker([destinationLocation.lat, destinationLocation.lng], { icon: destIcon })
          .bindPopup('Destination')
          .addTo(map.current);
      }
    }
  }, [destinationLocation]);

  // Update user location
  useEffect(() => {
    if (map.current && userLocation) {
      if (userMarker.current) {
        userMarker.current.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        userMarker.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .bindPopup('Your Location')
          .addTo(map.current);
      }
      map.current.setView([userLocation.lat, userLocation.lng], map.current.getZoom());
    }
  }, [userLocation]);

  // Update captain location
  useEffect(() => {
    if (map.current && captainLocation) {
      if (captainMarker.current) {
        captainMarker.current.setLatLng([captainLocation.lat, captainLocation.lng]);
      } else {
        captainMarker.current = L.marker([captainLocation.lat, captainLocation.lng], { icon: captainIcon })
          .bindPopup('Captain Location')
          .addTo(map.current);
      }
    }
  }, [captainLocation]);

  // Socket listeners for real-time captain locations
  useEffect(() => {
    socketService.onCaptainLocationUpdate((data) => {
      const { captainId, location } = data;
      
      setCaptains(prev => {
        const updated = { ...prev };
        updated[captainId] = location;
        
        // Update or create marker for this captain
        if (map.current) {
          const markerId = `captain-${captainId}`;
          const existingMarker = map.current._markers?.find(m => m._id === markerId);
          
          if (existingMarker) {
            existingMarker.setLatLng([location.lat, location.lng]);
          } else {
            L.marker([location.lat, location.lng], { icon: captainIcon })
              .bindPopup(`Captain ${captainId}`)
              .addTo(map.current);
          }
        }
        
        return updated;
      });
    });

    return () => {
      socketService.offListener('captain-location');
    };
  }, []);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <div 
        ref={mapContainer} 
        style={{ 
          height: '400px', 
          width: '100%',
          borderRadius: '8px'
        }}
      />
      <div className="p-4 bg-white border-t">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Pickup</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Captain</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>Your Location</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
