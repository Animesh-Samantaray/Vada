import React, { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import { mapsAPI } from "../services/api.js";

const LocationSearchPanel = ({ 
  setPanelOpen, 
  setVehiclePanelOpen, 
  setPickup, 
  setDestination, 
  setPickupLocation,
  setDestinationLocation,
  activeField 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchInput.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setError("");
    }
  }, [searchInput]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await mapsAPI.getSuggestions(searchInput);
      setSuggestions(response.data.suggestions || []);
      if (!response.data.suggestions || response.data.suggestions.length === 0) {
        setError("No suggestions found. Try another search.");
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setError("Failed to load suggestions. Please try again.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (location) => {
    // Generate mock coordinates for the location
    // In production, you'd get real coordinates from the maps API
    const lat = Math.random() * 180 - 90;
    const lng = Math.random() * 360 - 180;
    const locationCoords = { lat, lng };

    if (activeField === "pickup") {
      setPickup(location);
      setPickupLocation(locationCoords);
    } else {
      setDestination(location);
      setDestinationLocation(locationCoords);
    }
    setSuggestions([]);
    setSearchInput("");
    setVehiclePanelOpen(true);
    setPanelOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <input
        type="text"
        placeholder={`Search ${activeField || "location"}...`}
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          setError("");
        }}
        className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {error && (
        <div className="text-sm text-red-600 px-2 py-2">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-4 text-gray-500">
          Loading suggestions...
        </div>
      )}

      {suggestions.length > 0 ? (
        suggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => handleSelectLocation(suggestion)}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-300"
          >
            <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="ri-map-pin-fill text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">{suggestion}</h4>
              <p className="text-xs text-gray-500">Suggested location</p>
            </div>
          </div>
        ))
      ) : searchInput.length > 2 && !loading && !error ? (
        <div className="text-center py-4 text-gray-500">
          No suggestions found
        </div>
      ) : null}

      {/* Fallback suggestions if no API results */}
      {!searchInput && (
        <div className="text-gray-500 text-xs px-2 py-2">
          Type at least 3 characters to search locations
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;
