import React from "react";
import car from "../assets/caR.png";

const VehiclePanel = ({ setVehiclePanelOpen, setConfirmRidePanel }) => {
  return (
    <div className="p-4 space-y-3">
      <div
        className="text-center text-xl cursor-pointer"
        onClick={() => setVehiclePanelOpen(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </div>

      {[1, 2, 3].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border p-3 rounded-lg active:scale-95"
          onClick={() => {
            setVehiclePanelOpen(false);
            setConfirmRidePanel(true);
          }}
        >
          <div className="flex items-center gap-3">
            <img src={car} className="h-12 w-12 object-contain" />
            <div>
              <h3 className="text-sm font-semibold">Volvo R3</h3>
              <p className="text-xs text-gray-500">10 min away</p>
            </div>
          </div>

          <span className="font-semibold text-green-600">₹122</span>
        </div>
      ))}
    </div>
  );
};

export default VehiclePanel;
