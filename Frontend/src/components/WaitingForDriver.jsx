import React from 'react'

const WaitingForDriver = ({ setWaitingForDriver }) => {
  return (
    <div className="relative pt-8 px-4">
      {/* Close Arrow */}
      <h5
        className="text-center w-full absolute top-2 left-0 cursor-pointer"
        onClick={() => setWaitingForDriver(false)}
      >
        <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
      </h5>

      {/* Driver + Vehicle Info */}
      <div className="flex items-center justify-between mt-6">
        <img
          className="h-16 w-16 rounded-lg object-cover"
          src="https://documents.bcci.tv/resizedimageskirti/164_compress.png"
          alt="Car"
        />

        <div className="text-right ml-4">
          <h2 className="text-lg font-semibold capitalize">
            Suresh Nayak
          </h2>
          <h4 className="text-xl font-bold">
            OD 02 AB 4321
          </h4>
          <p className="text-sm text-gray-600">
            Maruti Suzuki Alto
          </p>
          <h1 className="text-lg font-semibold mt-1">
            OTP: 7845
          </h1>
        </div>
      </div>

      {/* Ride Details */}
      <div className="flex flex-col items-center mt-6">
        <div className="w-full">

          {/* Pickup */}
          <div className="flex items-start gap-4 p-3 border-b">
            <i className="ri-map-pin-user-fill text-xl mt-1"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm text-gray-600">
                KIIT Square, Bhubaneswar
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-4 p-3 border-b">
            <i className="ri-map-pin-2-fill text-xl mt-1"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm text-gray-600">
                Biju Patnaik Airport
              </p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-start gap-4 p-3">
            <i className="ri-currency-line text-xl mt-1"></i>
            <div>
              <h3 className="text-lg font-medium">₹249</h3>
              <p className="text-sm text-gray-600">
                Cash Payment
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver
