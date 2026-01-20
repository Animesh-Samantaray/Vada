import React from "react";
import car from "../assets/caR.png";

const ConfrimedRide = ({ setConfirmRidePanel,setVehicleFound }) => {
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
            Current Location
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Destination</span>
          <span className="font-medium text-gray-800 truncate">
            Biju Patnaik Park
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Estimated Fare</span>
          <span className="font-semibold text-green-600">
            ₹122
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
      onClick={()=>{setVehicleFound(true);
        setConfirmRidePanel(false);}
      }
        className="w-full bg-black text-white py-3 rounded-xl text-sm font-semibold
                   hover:bg-gray-900 active:scale-95 transition"
      >
        Confirm Ride
      </button>
    </div>
  );
};

export default ConfrimedRide;
