import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import FinishRide from './FinishRide';
const CaptainRiding = () => {
  const [finishRidePanel,setFinishRidePanel] = useState(false);
  const finishRidePanelRef=useRef(null);
    useGSAP(() => {
    if (!ridePopupPanelRef.current) return;

    gsap.to(finishRidePanelRef.current, {
      transform: finishRidePanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.35,
      ease: finishRidePanel ? "power3.out" : "power3.in",
    });
  }, [finishRidePanel]);
  return (
    <div className="h-screen w-screen bg-gray-100 relative overflow-hidden">
      <div className="fixed p-3 top-0  flex items-center justify-between w-screen">
        <img src={logo} className="w-16" alt="" />
        <Link
          to="/home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md z-10"
        >
          <i className="text-lg ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Top Empty / Map Placeholder */}
      <div className="h-1/2 bg-gray-300 flex items-center justify-center">
        <p className="text-gray-600 text-sm">Map / Live Tracking Area</p>
      </div>
      

      <div className='h-1/5 p-6 flex items-center justify-between bg-yellow-400' >
      <h5 className='p-1 text-center  w-[95%] absolute top-0' onClick={()=>{
setFinishRidePanel(true)
      }}>
        <i className='text-3xl font-gray-300 ri-arrow-down-wide-line'></i>
      </h5>
        <h4 className='text-xl font-semibold '>4 KM away</h4>
        <button className='bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete ride</button>
      </div>

        <div
        ref={confirmRidePanelRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl translate-y-full z-40"
      >
        <FinishRide 
        setFinishRidePanel={setFinishRidePanel}
        />
      </div>


    </div>
  )
}

export default CaptainRiding
