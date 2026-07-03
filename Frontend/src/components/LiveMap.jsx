import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom modern marker with a sleek dark background and a bright blue glowing dot
const customMarker = new L.divIcon({
  className: "custom-marker",
  html: `<div style="background-color: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #111111; box-shadow: 0 0 12px rgba(59, 130, 246, 0.8);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Component to handle auto-fitting the map to the route or marker
const MapBounds = ({ geometry, defaultLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (geometry && geometry.coordinates && geometry.coordinates.length > 0) {
      // GeoJSON is [lon, lat], Leaflet bounds needs [lat, lon]
      const latLngs = geometry.coordinates.map((coord) => [coord[1], coord[0]]);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (defaultLocation && defaultLocation.length === 2 && defaultLocation[0] !== null) {
      map.setView(defaultLocation, 15);
    }
  }, [geometry, defaultLocation, map]);

  return null;
};

const LiveMap = ({ geometry, defaultLocation }) => {
  // If no default location is provided, center on India initially
  const center = defaultLocation && defaultLocation[0] !== null ? defaultLocation : [20.5937, 78.9629];
  
  // Convert GeoJSON [lon, lat] coordinates to Leaflet [lat, lon] for Polyline
  const polylinePositions =
    geometry && geometry.coordinates
      ? geometry.coordinates.map((coord) => [coord[1], coord[0]])
      : [];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {polylinePositions.length > 0 && (
        <Polyline 
          positions={polylinePositions} 
          color="#3B82F6" 
          weight={6} 
          opacity={0.9} 
          lineCap="round" 
          lineJoin="round" 
        />
      )}
      {polylinePositions.length > 0 && (
        <>
          <Marker position={polylinePositions[0]} icon={customMarker} />
          <Marker position={polylinePositions[polylinePositions.length - 1]} icon={customMarker} />
        </>
      )}
      {polylinePositions.length === 0 && defaultLocation && defaultLocation[0] !== null && (
        <Marker position={defaultLocation} icon={customMarker} />
      )}
      <MapBounds geometry={geometry} defaultLocation={defaultLocation} />
    </MapContainer>
  );
};

export default LiveMap;
