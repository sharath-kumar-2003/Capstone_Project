import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import api from '../api';
import { getSocket } from '../socket';
import { useAuth } from '../context/AuthContext';

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
const myIcon = new L.Icon({
  iconUrl: '/marker-icon-2x-gold.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

export default function ActiveRidePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ride, setRide] = useState(state?.ride || null);
  const [myLoc, setMyLoc] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const watchIdRef = useRef(null);

  // Watch GPS and broadcast location
  useEffect(() => {
    if (!ride) return;
    const socket = getSocket();

    watchIdRef.current = navigator.geolocation?.watchPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        setMyLoc({ lat, lng });
        // Broadcast to backend (persisted) and directly via socket
        api.patch('/drivers/location', { lat, lng }).catch(() => {});
        socket.emit('driver:location_update', {
          driverId: user?.id,
          lat, lng,
          rideId: ride._id,
        });
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => {
      if (watchIdRef.current) navigator.geolocation?.clearWatch(watchIdRef.current);
    };
  }, [ride, user]);

  // Listen for cancellation
  useEffect(() => {
    if (!ride) return;
    const socket = getSocket();
    const onCancelled = ({ rideId }) => {
      if (rideId === ride._id) {
        alert('Rider has cancelled this ride.');
        navigate('/dashboard');
      }
    };
    socket.on('ride:cancelled', onCancelled);
    return () => socket.off('ride:cancelled', onCancelled);
  }, [ride, navigate]);

  // Fetch actual driving route from OSRM
  useEffect(() => {
    if (ride?.pickup?.lat && ride?.dropoff?.lat) {
      const fetchRoute = async () => {
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${ride.pickup.lng},${ride.pickup.lat};${ride.dropoff.lng},${ride.dropoff.lat}?overview=full&geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRouteCoordinates(coords);
          }
        } catch (err) {
          console.error('Error fetching route from OSRM:', err);
          // Fallback to straight line
          setRouteCoordinates([[ride.pickup.lat, ride.pickup.lng], [ride.dropoff.lat, ride.dropoff.lng]]);
        }
      };
      fetchRoute();
    } else {
      setRouteCoordinates([]);
    }
  }, [ride?.pickup?.lat, ride?.pickup?.lng, ride?.dropoff?.lat, ride?.dropoff?.lng]);

  const updateStatus = useCallback(async (status) => {
    setUpdating(true);
    setError('');
    try {
      const { data } = await api.patch(`/rides/${ride._id}/status`, { status });
      setRide(data);
      if (status === 'completed') {
        setTimeout(() => navigate('/earnings'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  }, [ride, navigate]);

  if (!ride) {
    navigate('/dashboard');
    return null;
  }

  const mapCenter = myLoc
    ? [myLoc.lat, myLoc.lng]
    : [ride.pickup.lat, ride.pickup.lng];

  const completed = ride.status === 'completed';

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      <nav className="navbar">
        <span className="navbar-brand">
          <span className="navbar-brand-accent">Active</span> Ride
        </span>
        <div className="navbar-user">
          <span className="text-sm">{user?.username}</span>
          <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
        </div>
      </nav>

      <div className="active-content">

        {/* Completion banner */}
        {completed && (
          <div className="complete-banner animate-in">
            <div className="complete-banner-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p className="fw-700 text-success" style={{ fontSize: '1.125rem' }}>Ride Completed!</p>
              <p className="text-sm text-secondary">Earned ${ride.fare} · Redirecting…</p>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="active-map">
          <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />
            <Marker position={[ride.pickup.lat, ride.pickup.lng]} icon={pickupIcon}>
              <Popup>📍 Pickup: {ride.pickup.address}</Popup>
            </Marker>
            <Marker position={[ride.dropoff.lat, ride.dropoff.lng]} icon={dropoffIcon}>
              <Popup>🏁 Dropoff: {ride.dropoff.address}</Popup>
            </Marker>
            {myLoc && (
              <Marker position={[myLoc.lat, myLoc.lng]} icon={myIcon}>
                <Popup>🚕 You</Popup>
              </Marker>
            )}
            {routeCoordinates.length > 0 && (
              <Polyline
                positions={routeCoordinates}
                pathOptions={{ color: '#059669', weight: 4 }}
              />
            )}
          </MapContainer>
        </div>

        {/* Ride info */}
        <div className="card ride-info-card animate-in">
          <div className="ride-info-header">
            <h3>Ride Details</h3>
            <span className={`badge badge-${ride.status}`}>
              {ride.status.replace('_', ' ')}
            </span>
          </div>

          {/* Rider */}
          <div className="ride-info-rider">
            <div className="ride-info-rider-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <p className="text-xs text-muted">Rider</p>
              <p className="fw-600">{ride.rider?.username || 'Unknown'}</p>
            </div>
          </div>

          {/* Route */}
          <div className="ride-route">
            <div style={{ position: 'relative' }}>
              <div className="route-dot" style={{ top: 4 }} />
              <p className="route-label">Pickup</p>
              <p className="route-address">{ride.pickup.address}</p>
            </div>
            <div style={{ position: 'relative', marginTop: '0.75rem' }}>
              <div className="route-dot end" style={{ bottom: 'auto', top: 4 }} />
              <p className="route-label">Dropoff</p>
              <p className="route-address">{ride.dropoff.address}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="ride-detail-row">
            <div className="ride-detail-stat">
              <p className="text-xs text-muted mb-1">Fare</p>
              <p className="ride-detail-stat-value text-accent">${ride.fare}</p>
            </div>
            <div className="ride-detail-stat">
              <p className="text-xs text-muted mb-1">Distance</p>
              <p className="ride-detail-stat-value">{ride.distance} km</p>
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          {/* Action buttons */}
          {ride.status === 'accepted' && (
            <button id="btn-start-ride" className="btn btn-primary btn-full mt-1" onClick={() => updateStatus('in_progress')} disabled={updating}>
              {updating ? <><div className="spinner" /> Starting…</> : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Start Ride
                </>
              )}
            </button>
          )}
          {ride.status === 'in_progress' && (
            <button id="btn-complete-ride" className="btn btn-primary btn-full mt-1" onClick={() => updateStatus('completed')} disabled={updating} style={{ background: 'var(--success)', borderColor: 'var(--success)' }}>
              {updating ? <><div className="spinner" /> Completing…</> : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Complete Ride
                </>
              )}
            </button>
          )}
          {completed && (
            <button id="btn-go-earnings" className="btn btn-ghost btn-full mt-1" onClick={() => navigate('/earnings')}>
              View Earnings
            </button>
          )}
        </div>
      </div>

      <div className="bottom-nav">
        <button className="bottom-nav-item" onClick={() => navigate('/dashboard')}>
          <span className="bottom-nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </span>
          Dashboard
        </button>
        <button className="bottom-nav-item" onClick={() => navigate('/earnings')}>
          <span className="bottom-nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </span>
          Earnings
        </button>
      </div>
    </div>
  );
}
