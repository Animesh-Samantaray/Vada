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

  try {
    const originCoords = await getAddressCoordinate(origin);
    const destinationCoords = await getAddressCoordinate(destination);

    // origin & destination must be { lat, lng }
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Earth radius in KM

    const dLat = toRad(destinationCoords.lat - originCoords.lat);
    const dLng = toRad(destinationCoords.lng - originCoords.lng);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(originCoords.lat)) *
        Math.cos(toRad(destinationCoords.lat)) *
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
  } catch (error) {
    console.error("Distance/Time calculation error:", error.message);
    // Return default distance/time if calculation fails
    return {
      distance: {
        text: "10 km",
        value: 10000,
      },
      duration: {
        text: "15 mins",
        value: 900,
      },
    };
  }
};


export const getAutoCompleteSuggestion = async (input) => {
  if (!input || input.length < 3) return [];

  try {
    // Try using OpenRouteService if API key is available
    if (process.env.ORS_API_KEY) {
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
    }
  } catch (error) {
    console.error("OpenRouteService error:", error.toString());
  }

  // Fallback: Use Nominatim (OpenStreetMap) - free, no API key needed
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: input,
          format: "json",
          limit: 5,
          countrycodes: "in", // India by default, can be made configurable
        },
        headers: {
          "User-Agent": "uber-clone-dev",
        },
      }
    );

    if (response.data && response.data.length > 0) {
      return response.data.map((location) => location.display_name);
    }
    
    return [];
  } catch (error) {
    console.error("Nominatim autocomplete error:", error.toString());
    return [];
  }
};
