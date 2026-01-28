import React, { useRef, useState, useEffect } from "react";
import map2 from "../assets/map2.jpg";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import LookingForDriver from "../components/LookingForDriver";
import RidePopup from "../components/RidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { CaptainDataContext } from "../context/CaptainContext";
import socketService from "../services/socket";
import geolocationService from "../services/geolocation";

const CaptainHome = () => {
  const { captain } = React.useContext(CaptainDataContext);
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [availableRides, setAvailableRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captainLocation, setCaptainLocation] = useState(null);
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  // Connect to Socket.io and join as captain
  useEffect(() => {
    socketService.connect();
    
    if (captain?._id) {
      socketService.captainJoin(captain._id);
    }

    // Listen for new rides in real-time
    socketService.onNewRide((rideData) => {
      setAvailableRides(prev => [rideData, ...prev]);
      
      if (!currentRide) {
        setCurrentRide(rideData);
        setRidePopupPanel(true);
      }
    });

    return () => {
      socketService.offListener('new-ride');
    };
  }, [captain?._id]);

  // Get captain's real-time live location (Like Uber Driver)
  useEffect(() => {
    // Get initial position
    geolocationService
      .getCurrentPosition()
      .then((location) => {
        setCaptainLocation(location);
        console.log('✅ Captain initial position:', location);
      })
      .catch((err) => {
        console.error('❌ Failed to get captain location:', err.message);
        alert('Please enable location services to accept rides');
      });

    // Start continuous real-time tracking
    geolocationService.startTracking(
      (location) => {
        // Update captain location state
        setCaptainLocation(location);

        // Emit location to all users in real-time
        if (captain?._id) {
          socketService.emitCaptainLocationUpdate(captain._id, {
            lat: location.lat,
            lng: location.lng,
          });
        }
      },
      (error) => {
        console.error('❌ Captain tracking error:', error.message);
      }
    );

    return () => {
      geolocationService.stopTracking();
    };
  }, [captain?._id]);

  useGSAP(() => {
    if (!ridePopupPanelRef.current) return;

    gsap.to(ridePopupPanelRef.current, {
      transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.35,
      ease: ridePopupPanel ? "power3.out" : "power3.in",
    });
  }, [ridePopupPanel]);

  useGSAP(() => {
    if (!confirmRidePopupPanelRef.current) return;

    gsap.to(confirmRidePopupPanelRef.current, {
      transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.35,
      ease: confirmRidePopupPanel ? "power3.out" : "power3.in",
    });
  }, [confirmRidePopupPanel]);

  return (
    <div className="h-screen w-screen bg-gray-100 relative overflow-hidden">
      <div className="fixed p-3 top-0 flex items-center justify-between w-screen z-10">
        <img src={logo} className="w-16" alt="logo" />
        <Link
          to="/captain-logout"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md z-10"
        >
          <i className="text-lg ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Top Empty / Map Placeholder */}
      <div className="h-1/2 bg-gray-300 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-sm">Map / Live Tracking Area</p>
          {captainLocation && (
            <p className="text-xs text-gray-500 mt-2">
              📍 Location: {captainLocation.lat.toFixed(2)}, {captainLocation.lng.toFixed(2)}
            </p>
          )}
        </div>
      </div>
      <div className="h-1/2 p-6 bg-white rounded-2xl shadow-sm">
        <CaptainDetails />
      </div>

      {availableRides.length === 0 ? (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white">
          <p className="text-center text-gray-500">Waiting for new rides...</p>
        </div>
      ) : null}

      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl translate-y-full shadow-2xl z-40"
        ref={ridePopupPanelRef}
      >
        <RidePopup
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          rideData={currentRide}
          setCurrentRide={setCurrentRide}
        />
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl translate-y-full shadow-2xl z-40"
        ref={confirmRidePopupPanelRef}
      >
        <ConfirmRidePopUp
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          currentRide={currentRide}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
