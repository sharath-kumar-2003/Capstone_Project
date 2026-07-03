const axios = require("axios");
const captainModel = require("../models/captain.model");

// Nominatim requires a User-Agent header per their usage policy
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const OSRM_BASE = "https://router.project-osrm.org";
const REQUEST_HEADERS = {
  "User-Agent": "QuickRide-App/1.0 (capstone-project)",
  "Accept-Language": "en",
};

// Helper: wait for a specified number of milliseconds
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: format distance in meters to human-readable text
const formatDistance = (meters) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

// Helper: format duration in seconds to human-readable text
const formatDuration = (seconds) => {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return mins > 0 ? `${hours} hour${hours > 1 ? "s" : ""} ${mins} min${mins !== 1 ? "s" : ""}` : `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  const mins = Math.round(seconds / 60);
  return `${mins} min${mins !== 1 ? "s" : ""}`;
};

/**
 * Geocode an address string to coordinates using Nominatim Search API.
 * Returns: { ltd: number, lng: number }
 */
module.exports.getAddressCoordinate = async (address) => {
  const url = `${NOMINATIM_BASE}/search`;

  console.log(`[OSM] Geocoding address: "${address}"`);

  try {
    const response = await axios.get(url, {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: REQUEST_HEADERS,
    });

    console.log("[OSM] Geocoding response status:", response.status);

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      console.log(`[OSM] Geocoded "${address}" → lat: ${result.lat}, lon: ${result.lon}`);
      return {
        ltd: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      };
    } else {
      throw new Error(`Geocoding failed: No results found for "${address}"`);
    }
  } catch (error) {
    if (error.response) {
      console.error("[OSM] Geocoding HTTP Error:", error.response.status, error.response.data);
    } else {
      console.error("[OSM] Geocoding Error:", error.message);
    }
    throw error;
  }
};

/**
 * Get driving distance and duration between two text addresses using
 * Nominatim (geocoding) + OSRM (routing).
 *
 * Returns the EXACT same shape as the old Google Distance Matrix element:
 * {
 *   distance: { text: "22.3 km", value: 22300 },
 *   duration: { text: "30 mins",  value: 1800  }
 * }
 *
 * This ensures ride.service.js continues to work with no changes.
 */
module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  console.log(`[OSM] Distance/Time request: "${origin}" → "${destination}"`);

  try {
    // Step 1: Geocode both addresses using Nominatim (Sequentially to respect 1 req/sec limit)
    const originCoords = await module.exports.getAddressCoordinate(origin);
    
    // Wait 1 second before making the second request to Nominatim
    await delay(1000);
    
    const destCoords = await module.exports.getAddressCoordinate(destination);

    // Step 2: Call OSRM for driving route
    // OSRM expects coordinates as lon,lat (not lat,lon)
    const osrmUrl = `${OSRM_BASE}/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destCoords.lng},${destCoords.ltd}`;

    console.log(`[OSM] OSRM route URL: ${osrmUrl}`);

    const response = await axios.get(osrmUrl, {
      params: { overview: "full", geometries: "geojson" },
      headers: REQUEST_HEADERS,
    });

    console.log("[OSM] OSRM response status:", response.status);

    if (response.data.code !== "Ok" || !response.data.routes || response.data.routes.length === 0) {
      console.error("[OSM] OSRM response body:", JSON.stringify(response.data));
      throw new Error(`OSRM routing failed: ${response.data.code || "No routes found"}`);
    }

    const route = response.data.routes[0];
    const distanceMeters = route.distance; // meters
    const durationSeconds = route.duration; // seconds

    console.log(`[OSM] Route result: ${formatDistance(distanceMeters)}, ${formatDuration(durationSeconds)}`);

    // Return in the exact same format as Google Distance Matrix element (plus geometry)
    return {
      distance: {
        text: formatDistance(distanceMeters),
        value: Math.round(distanceMeters),
      },
      duration: {
        text: formatDuration(durationSeconds),
        value: Math.round(durationSeconds),
      },
      geometry: route.geometry, // Add GeoJSON for the frontend map
    };
  } catch (err) {
    if (err.response) {
      console.error("[OSM] OSRM HTTP Error:", err.response.status, err.response.data);
    } else {
      console.error("[OSM] Distance/Time Error:", err.message);
    }
    throw err;
  }
};

/**
 * Get autocomplete/search suggestions for a text input using Nominatim Search API.
 * Returns: string[] — array of display_name strings (same as the old Google predictions).
 */
module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }

  const url = `${NOMINATIM_BASE}/search`;

  console.log(`[OSM] Autocomplete search: "${input}"`);

  try {
    const response = await axios.get(url, {
      params: {
        q: input,
        format: "json",
        limit: 5,
        addressdetails: 1,
      },
      headers: REQUEST_HEADERS,
    });

    console.log("[OSM] Autocomplete response status:", response.status);

    if (response.data && response.data.length > 0) {
      const suggestions = response.data
        .map((result) => result.display_name)
        .filter((value) => value);
      console.log(`[OSM] Found ${suggestions.length} suggestions`);
      return suggestions;
    } else {
      // Return empty array instead of throwing — no suggestions is not an error
      console.log("[OSM] No suggestions found");
      return [];
    }
  } catch (err) {
    if (err.response) {
      console.error("[OSM] Autocomplete HTTP Error:", err.response.status, err.response.data);
    } else {
      console.error("[OSM] Autocomplete Error:", err.message);
    }
    throw err;
  }
};

/**
 * Find captains within a radius (km) of a given coordinate.
 * This is a pure MongoDB query — no external API, unchanged.
 */
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius, vehicleType) => {
  // radius in km
  try {
    const captains = await captainModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, ltd], radius / 6371],
        },
      },
      "vehicle.type": vehicleType,
    });
    return captains;
  } catch (error) {
    throw new Error("Error in getting captain in radius: " + error.message);
  }
};
