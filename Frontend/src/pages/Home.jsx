import React, { useRef, useState, useEffect, useContext, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";

import logo from "../assets/logo.png";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfrimedRide from "../components/ConfrimedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import LiveMap from "../components/LiveMap";

import { UserDataContext } from "../context/UserContext";
import socketService from "../services/socket";
import geolocationService from "../services/geolocation";

const Home = () => {
  const { user } = useContext(UserDataContext);

  /* ---------------- STATE ---------------- */
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmedRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [fare, setFare] = useState(0);

  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);

  /* ---------------- REFS ---------------- */
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
    // Ensure socket is initialized before registering listeners.
    socketService.connect();

    if (user?._id) {
      socketService.userJoin(user._id);
    }

    const handleCaptainLoc = (data) => {
      if (data?.location) setCaptainLocation(data.location);
    };

    const handleRideAccepted = (data) => {
      if (data?.captainDetails?.location) setCaptainLocation(data.captainDetails.location);
      setWaitingForDriver(true);
    };

    socketService.onCaptainLocationUpdate(handleCaptainLoc);
    socketService.onRideAccepted(handleRideAccepted);

    return () => {
      socketService.offListener("captain-location");
      socketService.offListener("ride-accepted");
    };
  }, [user?._id]);

  /* ---------------- REAL-TIME GEOLOCATION (Like Uber) ---------------- */
  useEffect(() => {
    // Get initial position first
    geolocationService
      .getCurrentPosition()
      .then((location) => {
        setUserLocation(location);
      })
      .catch((err) => {
        console.error('Failed to get initial location:', err.message);
        alert('Please enable location services in your browser to use the app');
      });

    // Start continuous real-time tracking
    geolocationService.startTracking(
      (location) => {
        // Update user location state
        setUserLocation(location);

        // Emit location to other users in real-time via Socket.io
        if (user?._id) {
          socketService.emitUserLocationUpdate(user._id, {
            lat: location.lat,
            lng: location.lng,
          });
        }
      },
      (error) => {
        console.error('Geolocation tracking error:', error.message);
      }
    );

    return () => {
      geolocationService.stopTracking();
    };
  }, [user?._id]);

  const handleOpenPanel = useCallback(() => setPanelOpen(true), []);

  /* ---------------- GSAP ---------------- */
  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? "70%" : "0%",
      padding: panelOpen ? 24 : 0,
      duration: 0.35,
    });
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      y: vehiclePanelOpen ? "0%" : "100%",
      duration: 0.35,
    });
  }, [vehiclePanelOpen]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      y: confirmedRidePanel ? "0%" : "100%",
      duration: 0.35,
    });
  }, [confirmedRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      y: vehicleFound ? "0%" : "100%",
      duration: 0.35,
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      y: waitingForDriver ? "0%" : "100%",
      duration: 0.35,
    });
  }, [waitingForDriver]);

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <LiveMap
        pickupLocation={pickupLocation}
        destinationLocation={destinationLocation}
        userLocation={userLocation}
        captainLocation={captainLocation}
      />

      <img src={logo} className="w-16 absolute left-5 top-5 z-20" />

      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="bg-white p-6 shadow-lg">
          {panelOpen && (
            <h5
              ref={panelCloseRef}
              onClick={() => setPanelOpen(false)}
              className="absolute top-6 right-6 text-2xl cursor-pointer"
            >
              <i className="ri-arrow-down-wide-line" />
            </h5>
          )}

          <h4 className="text-2xl font-semibold">Find a trip</h4>

          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            onClick={() => setPanelOpen(true)}
            placeholder="Pickup location"
            className="w-full mt-3 p-2 bg-gray-100 rounded"
          />

          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onClick={() => setPanelOpen(true)}
            placeholder="Destination"
            className="w-full mt-2 p-2 bg-gray-100 rounded"
          />
        </div>

        <div ref={panelRef} className="bg-white overflow-hidden">
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanelOpen={setVehiclePanelOpen}
            setPickup={setPickup}
            setDestination={setDestination}
            setPickupLocation={setPickupLocation}
            setDestinationLocation={setDestinationLocation}
            activeField={pickup && !destination ? "destination" : "pickup"}
          />
        </div>
      </div>

      <div ref={vehiclePanelRef} className="absolute bottom-0 w-full z-30">
        <VehiclePanel
          pickup={pickup}
          destination={destination}
          setSelectedVehicle={setSelectedVehicle}
          setFare={setFare}
          setVehiclePanelOpen={setVehiclePanelOpen}
          setConfirmRidePanel={setConfirmRidePanel}
        />
      </div>

      <div ref={confirmRidePanelRef} className="absolute bottom-0 w-full z-40">
        <ConfrimedRide
          pickup={pickup}
          destination={destination}
          vehicleType={selectedVehicle}
          fare={fare}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div ref={vehicleFoundRef} className="absolute bottom-0 w-full z-40">
        <LookingForDriver />
      </div>

      <div ref={waitingForDriverRef} className="absolute bottom-0 w-full z-50">
        <WaitingForDriver />
      </div>
    </div>
  );
};

export default Home;
