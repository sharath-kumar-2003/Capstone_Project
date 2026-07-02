import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import api from '../api';
import { useAuth } from '../context/AuthContext';

// Custom marker icons
const pickupIcon = new L.Icon({
  iconUrl: '/marker-icon-2x-violet.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
const dropoffIcon = new L.Icon({
  iconUrl: '/marker-icon-2x-green.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

// Nominatim geocode helper
async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  const data = await res.json();
  if (!data.length) throw new Error('Address not found');
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

function MapClickHandler({ onPick, pickingMode }) {
  useMapEvents({
    click(e) {
      if (pickingMode) onPick(e.latlng);
    },
  });
  return null;
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState({ address: '', lat: null, lng: null });
  const [dropoff, setDropoff] = useState({ address: '', lat: null, lng: null });
  const [pickingMode, setPickingMode] = useState(null); // 'pickup' | 'dropoff' | null
  const [fare, setFare] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geoError, setGeoError] = useState('');
  const [center, setCenter] = useState([20.5937, 78.9629]); // India default
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);

  // Try to get user's current location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCenter([lat, lng]);
        setPickup((p) => ({ ...p, lat, lng }));
      },
      () => {}
    );
  }, []);

  // Recalculate fare preview whenever both coords set
  useEffect(() => {
    if (pickup.lat && dropoff.lat) {
      const R = 6371;
      const dLat = ((dropoff.lat - pickup.lat) * Math.PI) / 180;
      const dLng = ((dropoff.lng - pickup.lng) * Math.PI) / 180;
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos((pickup.lat * Math.PI) / 180) *
        Math.cos((dropoff.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
      const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      setDistance(dist.toFixed(2));
      setFare((2.5 + 1.2 * dist).toFixed(2));
    } else {
      setFare(null);
      setDistance(null);
    }
  }, [pickup, dropoff]);

  // Fetch actual driving route from OSRM
  useEffect(() => {
    if (pickup.lat && dropoff.lat) {
      const fetchRoute = async () => {
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRouteCoordinates(coords);
          }
        } catch (err) {
          console.error('Error fetching route from OSRM:', err);
          // Fallback to straight line
          setRouteCoordinates([[pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]]);
        }
      };
      fetchRoute();
    } else {
      setRouteCoordinates([]);
    }
  }, [pickup.lat, pickup.lng, dropoff.lat, dropoff.lng]);

  const handleGeocode = async (type) => {
    const addr = type === 'pickup' ? pickup.address : dropoff.address;
    if (!addr.trim()) return;
    setGeoError('');
    try {
      const coords = await geocode(addr);
      if (type === 'pickup') setPickup((p) => ({ ...p, ...coords }));
      else setDropoff((p) => ({ ...p, ...coords }));
    } catch {
      setGeoError(`Could not find: "${addr}"`);
    }
  };

  const handleMapPick = (latlng) => {
    if (pickingMode === 'pickup') setPickup((p) => ({ ...p, lat: latlng.lat, lng: latlng.lng }));
    else if (pickingMode === 'dropoff') setDropoff((p) => ({ ...p, lat: latlng.lat, lng: latlng.lng }));
    setPickingMode(null);
  };

  const handleRequest = async () => {
    if (!pickup.lat || !pickup.address) { setError('Set a pickup location'); return; }
    if (!dropoff.lat || !dropoff.address) { setError('Set a dropoff location'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/rides', { pickup, dropoff });
      navigate('/active', { state: { ride: data } });
    } catch (err) {
      setError(err.response?.data?.error || 'Could not request ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <span className="navbar-brand">
          <span className="navbar-brand-accent">Ride</span>Share
        </span>
        <div className="navbar-user">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/history')} style={{ gap: '0.375rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            History
          </button>
          <span className="text-sm fw-500">{user?.username}</span>
          <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <button id="btn-logout" className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="home-content">
        {/* ── Map ── */}
        <div className="home-map">
          {pickingMode && (
            <div className="home-map-picking-label">
              Click on map to set {pickingMode}
            </div>
          )}
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />
            <MapClickHandler onPick={handleMapPick} pickingMode={pickingMode} />
            {pickup.lat && (
              <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
                <Popup>📍 Pickup</Popup>
              </Marker>
            )}
            {dropoff.lat && (
              <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon}>
                <Popup>🏁 Dropoff</Popup>
              </Marker>
            )}
            {routeCoordinates.length > 0 && (
              <Polyline
                positions={routeCoordinates}
                pathOptions={{ color: '#2563eb', weight: 4 }}
              />
            )}
          </MapContainer>
        </div>

        {/* ── Request Form ── */}
        <div className="card animate-in home-form">
          <h2>Where to?</h2>

          {/* Pickup */}
          <div className="form-group">
            <label className="form-label" htmlFor="pickup-address">Pickup Location</label>
            <div className="home-form-row">
              <input
                id="pickup-address"
                className="input"
                placeholder="Enter pickup address"
                value={pickup.address}
                onChange={(e) => setPickup({ ...pickup, address: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleGeocode('pickup')}
              />
              <button
                id="btn-geocode-pickup"
                className="btn btn-ghost btn-sm"
                type="button"
                onClick={() => handleGeocode('pickup')}
                title="Search address"
                aria-label="Search pickup address"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
              <button
                id="btn-pick-pickup"
                className="btn btn-ghost btn-sm"
                type="button"
                onClick={() => setPickingMode(pickingMode === 'pickup' ? null : 'pickup')}
                style={{ borderColor: pickingMode === 'pickup' ? 'var(--accent)' : undefined, color: pickingMode === 'pickup' ? 'var(--accent)' : undefined }}
                title="Pick on map"
                aria-label="Pick pickup on map"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </button>
            </div>
            {pickup.lat && (
              <span className="text-xs text-muted">
                {pickup.lat.toFixed(5)}, {pickup.lng.toFixed(5)}
              </span>
            )}
          </div>

          {/* Dropoff */}
          <div className="form-group">
            <label className="form-label" htmlFor="dropoff-address">Dropoff Location</label>
            <div className="home-form-row">
              <input
                id="dropoff-address"
                className="input"
                placeholder="Enter dropoff address"
                value={dropoff.address}
                onChange={(e) => setDropoff({ ...dropoff, address: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleGeocode('dropoff')}
              />
              <button
                id="btn-geocode-dropoff"
                className="btn btn-ghost btn-sm"
                type="button"
                onClick={() => handleGeocode('dropoff')}
                title="Search address"
                aria-label="Search dropoff address"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
              <button
                id="btn-pick-dropoff"
                className="btn btn-ghost btn-sm"
                type="button"
                onClick={() => setPickingMode(pickingMode === 'dropoff' ? null : 'dropoff')}
                style={{ borderColor: pickingMode === 'dropoff' ? 'var(--success)' : undefined, color: pickingMode === 'dropoff' ? 'var(--success)' : undefined }}
                title="Pick on map"
                aria-label="Pick dropoff on map"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </button>
            </div>
            {dropoff.lat && (
              <span className="text-xs text-muted">
                {dropoff.lat.toFixed(5)}, {dropoff.lng.toFixed(5)}
              </span>
            )}
          </div>

          {geoError && <p className="text-sm text-danger">{geoError}</p>}

          {/* Fare estimate */}
          {fare && (
            <div className="home-fare-estimate">
              <div>
                <p className="text-xs text-muted" style={{ marginBottom: '0.125rem' }}>Estimated fare</p>
                <p className="home-fare-value">${fare}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-xs text-muted" style={{ marginBottom: '0.125rem' }}>Distance</p>
                <p className="fw-600">{distance} km</p>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            id="btn-request-ride"
            className="btn btn-primary btn-full"
            onClick={handleRequest}
            disabled={loading || !pickup.lat || !dropoff.lat}
          >
            {loading ? <><div className="spinner" /> Requesting…</> : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 002 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                Request Ride
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
