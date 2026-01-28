import React, { useEffect, useState } from "react";
import { ridesAPI } from "../services/api.js";

const RidePopUp = ({ setRidePopupPanel, setConfirmRidePopupPanel, rideData, setCurrentRide }) => {
  const [loading, setLoading] = useState(false);

  if (!rideData) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No ride available</p>
      </div>
    );
  }

  const handleAcceptRide = async () => {
    try {
      setLoading(true);
      const response = await ridesAPI.acceptRide(rideData._id);
      if (response.status === 200) {
        setCurrentRide(response.data);
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);
      }
    } catch (error) {
      console.error("Failed to accept ride:", error);
      alert("Failed to accept ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">
        New Ride Available!
      </h3>

      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt="user"
          />
          <h2 className="text-lg font-medium">
            {rideData.user?.fullname?.firstName} {rideData.user?.fullname?.lastName}
          </h2>
        </div>
        <h5 className="text-lg font-semibold text-blue-600">
          {rideData.distance || "--"} km
        </h5>
      </div>

      <div className="w-full mt-5">
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-map-pin-user-fill"></i>
          <div>
            <h3 className="text-lg font-medium">Pickup</h3>
            <p className="text-sm text-gray-600">{rideData.pickup}</p>
          </div>
        </div>

        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-map-pin-2-fill"></i>
          <div>
            <h3 className="text-lg font-medium">Destination</h3>
            <p className="text-sm text-gray-600">{rideData.destination}</p>
          </div>
        </div>

        <div className="flex items-center gap-5 p-3">
          <i className="ri-currency-line"></i>
          <div>
            <h3 className="text-lg font-medium">₹{rideData.fare}</h3>
            <p className="text-sm text-gray-600">Cash</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 justify-between">
        <button
          className={`bg-green-600 w-full text-white font-semibold p-2 rounded-lg ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
          onClick={handleAcceptRide}
          disabled={loading}
        >
          {loading ? "Accepting..." : "Accept"}
        </button>
        <button
          onClick={() => setRidePopupPanel(false)}
          className="mt-0 w-full bg-gray-300 text-gray-700 font-semibold p-2 rounded-lg hover:bg-gray-400"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;
