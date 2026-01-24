import React from 'react'
import { Link } from 'react-router-dom'

const Riding = () => {
  return (
    <div className="h-screen w-screen bg-gray-100 relative overflow-hidden">
      
      {/* Home Button */}
      <Link
        to="/home"
        className="fixed right-4 top-4 h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md z-10"
      >
        <i className="text-lg ri-home-5-line"></i>
      </Link>

      {/* Top Empty / Map Placeholder */}
      <div className="h-1/2 bg-gray-300 flex items-center justify-center">
        <p className="text-gray-600 text-sm">Map / Live Tracking Area</p>
      </div>

      {/* Bottom Ride Info */}
      <div className="h-1/2 bg-white p-4 rounded-t-2xl shadow-lg">
        
        {/* Driver Info */}
        <div className="flex items-center justify-between">
          <img
            className="h-20 w-28 rounded-lg object-cover"
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
            alt="Car"
          />

          <div className="text-right">
            <h2 className="text-lg font-semibold capitalize">
              Suresh Nayak
            </h2>
            <h4 className="text-xl font-bold">
              OD 02 AB 4321
            </h4>
            <p className="text-sm text-gray-600">
              Maruti Suzuki Alto
            </p>
          </div>
        </div>

        {/* Ride Details */}
        <div className="mt-6">

          <div className="flex items-start gap-4 p-3 border-b">
            <i className="text-xl ri-map-pin-2-fill mt-1"></i>
            <div>
              <h3 className="text-base font-medium">Destination</h3>
              <p className="text-sm text-gray-600">
                Biju Patnaik Airport, Bhubaneswar
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-3">
            <i className="text-xl ri-currency-line mt-1"></i>
            <div>
              <h3 className="text-base font-medium">₹249</h3>
              <p className="text-sm text-gray-600">
                Cash Payment
              </p>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <button className="w-full mt-6 bg-green-600 hover:bg-green-700 transition text-white font-semibold py-3 rounded-lg">
          Make a Payment
        </button>
      </div>

    </div>
  )
}

export default Riding
