import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ridesAPI } from '../services/api.js';

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const ride = props.currentRide || {
    user: {
      fullname: {
        firstName: "User",
        lastName: "Name",
      },
    },
    pickup: "Not selected",
    destination: "Not selected",
    fare: 0,
    distance: "-- KM",
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await ridesAPI.startRide(ride._id, otp);

      if (response.status === 200) {
        // Ride started successfully
        props.setRidePopupPanel(false);
        props.setConfirmRidePopupPanel(false);
        navigate('/captain-riding');
      }
    } catch (error) {
      console.error('Failed to start ride:', error);
      setError(error.response?.data?.message || 'Failed to start ride. Invalid OTP?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen'>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => props.setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">
        Confirm this ride to start
      </h3>

      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt="user"
          />
          <h2 className="text-lg font-medium">
            {ride.user?.fullname?.firstName} {ride.user?.fullname?.lastName}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">{ride.distance}</h5>
      </div>

      <div className="w-full mt-5">
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-map-pin-user-fill"></i>
          <div>
            <h3 className="text-lg font-medium">Pickup</h3>
            <p className="text-sm text-gray-600">{ride.pickup}</p>
          </div>
        </div>

        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-map-pin-2-fill"></i>
          <div>
            <h3 className="text-lg font-medium">Destination</h3>
            <p className="text-sm text-gray-600">{ride.destination}</p>
          </div>
        </div>

        <div className="flex items-center gap-5 p-3">
          <i className="ri-currency-line"></i>
          <div>
            <h3 className="text-lg font-medium">₹{ride.fare}</h3>
            <p className="text-sm text-gray-600">Cash</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-5 w-full flex flex-col items-center justify-center gap-3">
        <form onSubmit={submitHandler} className="w-full">
          <input
            type="text"
            placeholder='Enter 6-digit OTP'
            onChange={(e) => {
              setOtp(e.target.value);
              setError('');
            }}
            value={otp}
            maxLength="6"
            className="w-full bg-[#eee] px-6 py-4 rounded-lg text-center tracking-widest"
          />
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className={`w-full mt-3 text-white font-semibold p-2 rounded-lg transition ${
              loading || otp.length !== 6
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Starting ride...' : 'Start Ride'}
          </button>
        </form>

        <button
          onClick={() => {
            props.setConfirmRidePopupPanel(false);
            props.setRidePopupPanel(true);
          }}
          className="mt-2 w-full bg-red-500 text-white font-semibold p-2 rounded-lg hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;

