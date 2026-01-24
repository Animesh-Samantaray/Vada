import React, { useRef, useState } from "react";
import map2 from "../assets/map2.jpg";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import LookingForDriver from "../components/LookingForDriver";
import RidePopup from "../components/RidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
const CaptainHome = () => {
  const [ridePopupPanel,setRidePopupPanel] = useState(true);
  const [confirmRidePopupPanel,setConfirmRidePopupPanel] = useState(false);
  const ridePopupPanelRef=useRef(null)
  const confirmRidePopupPanelRef=useRef(null);
  useGSAP(() => {
    if (!ridePopupPanelRef.current) return;

    gsap.to(ridePopupPanelRef.current, {
      transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.35,
      ease: ridePopupPanel ? "power3.out" : "power3.in",
    });
  }, [ridePopupPanel]);

    useGSAP(() => {
    if (!confirmRidePopupPanelRef.current) return;

    gsap.to(confirmRidePopupPanelRef.current, {
      transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.35,
      ease: confirmRidePopupPanel ? "power3.out" : "power3.in",
    });
  }, [confirmRidePopupPanel]);

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
      <div className="h-1/2 p-6 bg-white rounded-2xl shadow-sm">
        <CaptainDetails />
      </div>

      <div
        
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl translate-y-full shadow-2xl  z-40"
        ref={ridePopupPanelRef}
      >
        <RidePopup  setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel}/>
      </div>

      <div
        
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl translate-y-full shadow-2xl  z-40"
        ref={confirmRidePopupPanelRef}
      >
        <ConfirmRidePopUp  setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel}/>
      </div>
    </div>
  );
};

export default CaptainHome;
