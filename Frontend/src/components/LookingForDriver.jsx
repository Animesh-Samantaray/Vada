import React from 'react'

const LookingForDriver = ({ setVehicleFound }) => {
    return (
        <div>
            {/* Close Arrow */}
            <h5
                className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
                onClick={() => setVehicleFound(false)}
            >
                <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className='text-2xl font-semibold mb-5 text-center'>
                Looking for a Driver
            </h3>

            <div className='flex gap-3 justify-between flex-col items-center'>
                
                {/* Car Image */}
                <img
                    className='h-20 rounded-md'
                    src="https://images.unsplash.com/photo-1549924231-f129b911e442"
                    alt="Car"
                />

                {/* Driver Name */}
                <h4 className='text-lg font-medium text-gray-800'>
                    Driver: Rahul Kumar
                </h4>

                <div className='w-full mt-5'>

                    {/* Pickup */}
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>
                                KIIT Square, Bhubaneswar
                            </p>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-2-fill text-xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>
                                Biju Patnaik Airport
                            </p>
                        </div>
                    </div>

                    {/* Fare */}
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹249</h3>
                            <p className='text-sm -mt-1 text-gray-600'>
                                Cash Payment
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default LookingForDriver
