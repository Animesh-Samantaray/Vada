import React, { useEffect, useState } from "react";
import car from "../assets/caR.png";
import { ridesAPI } from "../services/api.js";

const VehiclePanel = ({ setVehiclePanelOpen, setConfirmRidePanel, pickup, destination, setSelectedVehicle, setFare }) => {
  const [fares, setFares] = useState({
    auto: 50,
    car: 100,
    moto: 30,
  });
  const [loading, setLoading] = useState(false);
  const vehicles = [
    { type: 'auto', name: 'Auto', image: car, icon: 'ri-e-bike-2-fill' },
    { type: 'car', name: 'Car', image: car, icon: 'ri-car-fill' },
    { type: 'moto', name: 'Bike', image: car, icon: 'ri-ride-share-line' },
  ];

  useEffect(() => {
    if (pickup && destination) {
      fetchFares();
    }
  }, [pickup, destination]);

  const fetchFares = async () => {
    if (!pickup || !destination) return;

    try {
      setLoading(true);
      console.log('🚗 Fetching fares for:', { pickup, destination });
      
      // Try to get real fares from API
      const fareAuto = await ridesAPI.getFare(pickup, destination, 'auto');
      const fareCar = await ridesAPI.getFare(pickup, destination, 'car');
      const fareMoto = await ridesAPI.getFare(pickup, destination, 'moto');

      setFares({
        auto: fareAuto.data.fare,
        car: fareCar.data.fare,
        moto: fareMoto.data.fare,
      });
      console.log('✅ Fares fetched successfully');
    } catch (error) {
      console.warn("⚠️ Could not fetch fares from API, using default fares:", error.message);
      // Use default fares if API fails
      setFares({
        auto: 50,
        car: 100,
        moto: 30,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVehicle = (vehicleType, fare) => {
    setSelectedVehicle(vehicleType);
    setFare(fare);
    setVehiclePanelOpen(false);
    setConfirmRidePanel(true);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <div className="text-center text-xl cursor-pointer" onClick={() => setVehiclePanelOpen(false)}>
          <i className="ri-arrow-down-wide-line"></i>
        </div>
        <p className="text-center text-gray-500">Loading vehicles...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <div
        className="text-center text-xl cursor-pointer"
        onClick={() => setVehiclePanelOpen(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </div>

      {vehicles.map((vehicle) => (
        <div
          key={vehicle.type}
          className="flex items-center justify-between border p-3 rounded-lg active:scale-95 cursor-pointer hover:bg-gray-50"
          onClick={() => handleSelectVehicle(vehicle.type, fares[vehicle.type])}
        >
          <div className="flex items-center gap-3">
            <img src={vehicle.image} className="h-12 w-12 object-contain" alt={vehicle.name} />
            <div>
              <h3 className="text-sm font-semibold">{vehicle.name}</h3>
              <p className="text-xs text-gray-500">2-3 min away</p>
            </div>
          </div>

          <span className="font-semibold text-green-600">₹{fares[vehicle.type]}</span>
        </div>
      ))}
    </div>
  );
};

export default VehiclePanel;
