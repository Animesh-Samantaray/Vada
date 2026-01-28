import axios from "axios";


export const getAddressCoordinate = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search`;

  try {
    const response = await axios.get(url, {
      params: {
        q: address,
        format: "json",
        limit: 1
      },
      headers: {
        "User-Agent": "uber-clone-dev"
      }
    });

    if (response.data.length === 0) {
      throw new Error("Address not found");
    }

    const location = response.data[0];

    return {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon)
    };
  } catch (error) {
    console.error("Map error:", error.message);
    throw error;
  }
};


export const getDistanceTime1 = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }
origin=await getAddressCoordinate(origin)
destination=await getAddressCoordinate(destination)
  // origin & destination must be { lat, lng }
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Earth radius in KM

  const dLat = toRad(destination.lat - origin.lat);
  const dLng = toRad(destination.lng - origin.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(origin.lat)) *
      Math.cos(toRad(destination.lat)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceKm = R * c;

  // assume avg speed 35 km/h (city traffic)
  const durationMin = (distanceKm / 35) * 60;

  return {
    distance: {
      text: `${distanceKm.toFixed(2)} km`,
      value: Math.round(distanceKm * 1000),
    },
    duration: {
      text: `${Math.round(durationMin)} mins`,
      value: Math.round(durationMin * 60),
    },
  };
};


export const getAutoCompleteSuggestion = async (input) => {
  if (!input || input.length < 3) return [];

  try {
    const response = await axios.get(
      "https://api.openrouteservice.org/geocode/autocomplete",
      {
        params: {
          api_key: process.env.ORS_API_KEY,
          text: input,
          size: 5,
        },
      }
    );

    return response.data.features.map(
      (f) => f.properties.label
    );
  } catch (error) {
    console.error("Autocomplete error:", error.toString());
    return [];
  }
};
