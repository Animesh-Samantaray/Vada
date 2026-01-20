import React, { useRef, useState } from "react";
import map2 from "../assets/map2.jpg";
import logo from "../assets/logo.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfrimedRide from "../components/ConfrimedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmedRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);




  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
const waitingForDriverRef = useRef(null);

  const submitHandler = (e) => e.preventDefault();

  useGSAP(() => {
    if (!panelRef.current) return;

    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        padding: 24,
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(panelCloseRef.current, { y: 0, duration: 0.2 });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: 0,
        duration: 0.3,
        ease: "power3.in",
      });
      gsap.to(panelCloseRef.current, { y: -10, duration: 0.2 });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (!vehiclePanelRef.current) return;

    if (vehiclePanelOpen) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.35,
        ease: "power3.out",
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.35,
        ease: "power3.in",
      });
    }
  }, [vehiclePanelOpen]);

//   useGSAP(() => {
//   const el = waitingForDriverRef.current;
//   if (!el) return;

//   gsap.to(el, {
//     y: waitingForDriver ? "0%" : "100%",
//     duration: 0.35,
//     ease: "power3.out",
//   });
// }, [waitingForDriver]);

useGSAP(() => {
  gsap.to(waitingForDriverRef.current, {
    y: waitingForDriver ? "0%" : "100%",
  });
}, [waitingForDriver]);

  useGSAP(() => {
    if (!confirmRidePanelRef.current) return;

    gsap.set(confirmRidePanelRef.current, {
      y: "100%",
    });

    if (confirmedRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        y: "0%",
        duration: 0.35,
        ease: "power3.out",
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        y: "100%",
        duration: 0.35,
        ease: "power3.in",
      });
    }
  }, [confirmedRidePanel]);


  useGSAP(() => {
    if (!vehicleFoundRef.current) return;

    gsap.set(vehicleFoundRef.current, {
      y: "100%",
    });


    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        y: "0%",
        duration: 0.35,
        ease: "power3.out",
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        y: "100%",
        duration: 0.35,
        ease: "power3.in",
      });
    }
  }, [vehicleFound]);


  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <img
        src={map2}
        alt="map"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <img src={logo} alt="logo" className="w-16 absolute left-5 top-5 z-20" />

      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="h-[30%] bg-white p-6 relative shadow-lg">
          {panelOpen && (
            <h5
              ref={panelCloseRef}
              onClick={() => setPanelOpen(false)}
              className="absolute top-6 right-6 text-2xl cursor-pointer"
            >
              <i className="ri-arrow-down-wide-line"></i>
            </h5>
          )}

          <h4 className="text-3xl font-semibold">Find a trip</h4>

          <form onSubmit={submitHandler} className="flex flex-col gap-3 mt-4">
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              onClick={() => setPanelOpen(true)}
              placeholder="Add a pickup location"
              className="bg-gray-100 px-4 py-2 rounded-lg"
            />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onClick={() => setPanelOpen(true)}
              placeholder="Enter your destination"
              className="bg-gray-100 px-4 py-2 rounded-lg"
            />
          </form>
        </div>

        <div ref={panelRef} className="bg-white h-0 overflow-hidden shadow-2xl">
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanelOpen={setVehiclePanelOpen}
          />
        </div>
      </div>

      {vehiclePanelOpen && (
        <div
          className="absolute inset-0 z-20"
          onClick={() => setVehiclePanelOpen(false)}
        />
      )}

      <div
        ref={vehiclePanelRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl translate-y-full z-30"
      >
        <VehiclePanel
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanelOpen={setVehiclePanelOpen}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl translate-y-full z-40"
      >
        <ConfrimedRide setConfirmRidePanel={setConfirmRidePanel}
        setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl translate-y-full z-40"
      >
        <LookingForDriver setConfirmRidePanel={setConfirmRidePanel}  setVehicleFound={setVehicleFound}/>
      </div>

      <div
  ref={waitingForDriverRef}
  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl translate-y-full z-50"
>
  <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
</div>

  
    </div>
  );
};

export default Home;
