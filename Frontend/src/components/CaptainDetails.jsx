import React from 'react'

const CaptainDetails = () => {
  return (
    <div>
      {/* Header */}
        <div className="flex items-center justify-between  p-5 rounded-xl">
          <div className="flex items-center gap-4">
            <img
              className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-300"
              src="https://documents.iplt20.com/ipl/IPLHeadshot2025/2.png"
              alt="Captain Avatar"
            />
            <div>
              <h4 className="text-lg font-bold text-gray-900">Virat Babu</h4>
              <p className="text-sm font-medium text-gray-600">Captain</p>
            </div>
          </div>

          <div className="text-right">
            <h4 className="text-2xl font-bold text-gray-900">₹500.47</h4>
            <p className="text-sm font-medium text-gray-600">Total Earned</p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gray-200" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 text-center bg-gray-100 p-5 rounded-xl">
          <div className="flex flex-col items-center">
            <i className="ri-timer-2-line text-2xl text-gray-800 mb-2"></i>
            <h5 className="text-xl font-bold text-gray-900">12</h5>
            <p className="text-sm font-medium text-gray-600">Hours Online</p>
          </div>

          <div className="flex flex-col items-center">
            <i className="ri-speed-up-line text-2xl text-gray-800 mb-2"></i>
            <h5 className="text-xl font-bold text-gray-900">12</h5>
            <p className="text-sm font-medium text-gray-600">Trips Completed</p>
          </div>

          <div className="flex flex-col items-center">
            <i className="ri-booklet-line text-2xl text-gray-800 mb-2"></i>
            <h5 className="text-xl font-bold text-gray-900">12</h5>
            <p className="text-sm font-medium text-gray-600">Ratings</p>
          </div>
        </div>
    </div>
  )
}

export default CaptainDetails
