import React from "react";
import "remixicon/fonts/remixicon.css";

const LocationSearchPanel = ({ setPanelOpen, setVehiclePanelOpen }) => {
  const locations = [
    "132B, Near Ram Mandir, Bhubaneswar",
    "Master Canteen Square, Bhubaneswar",
    "Biju Patnaik Park, Forest Park",
  ];

  return (
    <div className="flex flex-col gap-4">
      {locations.map((location, index) => (
        <div
          key={index}
          onClick={() => {
            setPanelOpen(false);
            setVehiclePanelOpen(true);
          }}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 cursor-pointer"
        >
          <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center">
            <i className="ri-map-pin-fill text-lg"></i>
          </div>
          <h4 className="text-sm font-medium">{location}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
