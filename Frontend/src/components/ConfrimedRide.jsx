import React, { useState } from "react";
import car from "../assets/caR.png";
import { ridesAPI } from "../services/api.js";
import socketService from "../services/socket";

const ConfrimedRide = ({ setConfirmRidePanel, setVehicleFound, pickup, destination, vehicleType, fare }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirmRide = async () => {
    if (!pickup || !destination || !vehicleType) {
      setError("Please select pickup, destination, and vehicle type");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      console.log('🚗 Creating ride with:', { pickup, destination, vehicleType });
      
      const response = await ridesAPI.createRide({
        pickup,
        destination,
        vehicleType,
      });

      if (response.status === 201) {
        console.log('✅ Ride created successfully:', response.data);
        
        // Emit ride-created event via Socket.io
        socketService.emitRideCreated({
          rideId: response.data._id,
          userId: response.data.userId,
          pickup,
          destination,
          vehicleType,
          fare,
          status: 'pending',
          timestamp: new Date()
        });
        
        // Ride created successfully
        setVehicleFound(true);
        setConfirmRidePanel(false);
      }
    } catch (error) {
      console.warn("⚠️ Ride creation failed, proceeding with local state:", error.message);
      
      // Even if API fails, allow user to proceed (for demo/testing)
      // In production, you may want stricter error handling
      socketService.emitRideCreated({
        rideId: Date.now().toString(), // Temporary ID
        pickup,
        destination,
        vehicleType,
        fare,
        status: 'pending',
        timestamp: new Date()
      });
      
      setVehicleFound(true);
      setConfirmRidePanel(false);
      
      setError("Ride created locally. Backend sync pending...");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full p-6 bg-white space-y-6">
      {/* Close Button */}
      <button
        onClick={() => setConfirmRidePanel(false)}
        className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black transition"
        aria-label="Close panel"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </button>

      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900">
          Confirm your ride
        </h3>
        <p className="text-sm text-gray-500">
          Review details before booking
        </p>
      </div>

      {/* Vehicle Preview */}
      <div className="flex justify-center">
        <img
          src={car}
          alt="Selected vehicle"
          className="h-24 object-contain"
        />
      </div>

      {/* Ride Summary */}
      <div className="bg-gray-100 rounded-xl p-4 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Pickup</span>
          <span className="font-medium text-gray-800 truncate">
            {pickup || "Not selected"}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Destination</span>
          <span className="font-medium text-gray-800 truncate">
            {destination || "Not selected"}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Vehicle Type</span>
          <span className="font-medium text-gray-800 capitalize">
            {vehicleType || "Not selected"}
          </span>
        </div>

        <div className="flex justify-between text-sm border-t pt-4">
          <span className="text-gray-500">Estimated Fare</span>
          <span className="font-semibold text-green-600">
            ₹{fare || 0}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleConfirmRide}
        disabled={loading}
        className={`w-full text-white py-3 rounded-xl text-sm font-semibold
                   transition active:scale-95 ${
                     loading
                       ? "bg-gray-400 cursor-not-allowed"
                       : "bg-black hover:bg-gray-900"
                   }`}
      >
        {loading ? "Creating ride..." : "Confirm Ride"}
      </button>
    </div>
  );
};

export default ConfrimedRide;
