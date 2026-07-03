import { useState, useEffect, useRef } from 'react';
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
const driverIcon = new L.Icon({
  iconUrl: '/marker-icon-2x-gold.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

export default function ActiveRidePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ride, setRide] = useState(state?.ride || null);
  const [driverLoc, setDriverLoc] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [cancelling, setCancelling] = useState(false);
  const [rating, setRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!ride) return;

    if (ride.status === 'completed' && !ride.rating) {
      setShowRating(true);
    }

    const socket = getSocket();
    const onAccepted = (updatedRide) => {
      if (updatedRide._id === ride._id) setRide(updatedRide);
    };
    const onInProgress = (updatedRide) => {
      if (updatedRide._id === ride._id) setRide(updatedRide);
    };
    const onCompleted = (updatedRide) => {
      if (updatedRide._id === ride._id) {
        setRide(updatedRide);
        if (!updatedRide.rating) setShowRating(true);
      }
    };
    const onLocUpdate = ({ rideId, lat, lng }) => {
      if (rideId === ride._id) setDriverLoc({ lat, lng });
    };

    socket.on('ride:accepted', onAccepted);
    socket.on('ride:in_progress', onInProgress);
    socket.on('ride:completed', onCompleted);
    socket.on('driver:location_update', onLocUpdate);

    return () => {
      socket.off('ride:accepted', onAccepted);
      socket.off('ride:in_progress', onInProgress);
      socket.off('ride:completed', onCompleted);
      socket.off('driver:location_update', onLocUpdate);
    };
  }, [ride]);

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
        } catch {
          setRouteCoordinates([[ride.pickup.lat, ride.pickup.lng], [ride.dropoff.lat, ride.dropoff.lng]]);
        }
      };
      fetchRoute();
    }
  }, [ride?.pickup?.lat, ride?.pickup?.lng, ride?.dropoff?.lat, ride?.dropoff?.lng]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.patch(`/rides/${ride._id}/status`, { status: 'cancelled' });
      navigate('/home');
    } catch {
      alert('Failed to cancel ride');
      setCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  const handleRate = async () => {
    if (!rating) return;
    setSubmittingRating(true);
    try {
      await api.post(`/rides/${ride._id}/rate`, { rating });
      setShowRating(false);
      navigate('/history');
    } catch {
      alert('Failed to submit rating');
      setSubmittingRating(false);
    }
  };

  if (!ride) {
    navigate('/home');
    return null;
  }

  const mapCenter = [ride.pickup.lat, ride.pickup.lng];

  return (
    <div className="page" style={{ position: 'relative' }}>
      <nav className="navbar">
        <span className="navbar-brand">
          <span className="navbar-brand-accent">Active</span> Ride
        </span>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/home')}>
          Back to Home
        </button>
      </nav>

      {/* Progress tracker */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '1rem 1.5rem' }}>
        <div className="steps container">
          <div className={`step ${ride.status !== 'pending' ? 'done' : 'active'}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Requested</span>
          </div>
          <div className={`step ${['in_progress', 'completed'].includes(ride.status) ? 'done' : ride.status === 'accepted' ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Driver Assigned</span>
          </div>
          <div className={`step ${ride.status === 'completed' ? 'done' : ride.status === 'in_progress' ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span className="step-label">In Transit</span>
          </div>
        </div>
      </div>

      <div className="active-content container">
        {/* Driver assigned banner */}
        {ride.status !== 'pending' && ride.driver && !showRating && (
          <div className="driver-banner animate-in">
            <div className="driver-banner-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p className="fw-700 text-info" style={{ fontSize: '1.125rem', marginBottom: '0.125rem' }}>Driver Assigned</p>
              <p className="text-sm fw-600">
                {ride.driver.username}
                {ride.driver.vehicle && <span className="text-secondary fw-500"> • {ride.driver.vehicle.make} {ride.driver.vehicle.model} ({ride.driver.vehicle.plate})</span>}
              </p>
            </div>
          </div>
        )}

        <div className="card active-map">
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />
            <Marker position={[ride.pickup.lat, ride.pickup.lng]} icon={pickupIcon}>
              <Popup>Pickup</Popup>
            </Marker>
            <Marker position={[ride.dropoff.lat, ride.dropoff.lng]} icon={dropoffIcon}>
              <Popup>Dropoff</Popup>
            </Marker>
            {driverLoc && (
              <Marker position={[driverLoc.lat, driverLoc.lng]} icon={driverIcon}>
                <Popup>Driver</Popup>
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

        <div className="card flex-col gap-2 animate-in">
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

          <div className="ride-detail-row">
            <div className="ride-detail-stat">
              <p className="text-xs text-muted mb-1">Fare</p>
              <p className="ride-detail-stat-value">${ride.fare}</p>
            </div>
            <div className="ride-detail-stat">
              <p className="text-xs text-muted mb-1">Distance</p>
              <p className="ride-detail-stat-value">{ride.distance} km</p>
            </div>
          </div>

          {['pending', 'accepted'].includes(ride.status) && (
            showCancelConfirm ? (
              <div className="cancel-confirm animate-in">
                <p className="fw-600 text-center text-danger">Are you sure you want to cancel this ride?</p>
                <div className="cancel-confirm-actions">
                  <button className="btn btn-danger btn-full" onClick={handleCancel} disabled={cancelling}>
                    {cancelling ? <div className="spinner" /> : 'Yes, Cancel Ride'}
                  </button>
                  <button className="btn btn-ghost btn-full" onClick={() => setShowCancelConfirm(false)} disabled={cancelling}>
                    No, Keep It
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn btn-ghost btn-full mt-1" onClick={() => setShowCancelConfirm(true)}>
                Cancel Ride
              </button>
            )
          )}
        </div>
      </div>

      {/* Rating modal overlay */}
      {showRating && (
        <div className="rating-overlay animate-in">
          <div className="card rating-card">
            <div className="rating-complete-banner">
              <h2 className="text-success mb-1">Ride Completed</h2>
              <p className="text-sm fw-500">Your driver has reached the destination.</p>
            </div>
            <div className="flex-col items-center">
              <h3 className="mb-2">How was your ride?</h3>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="rating-star-btn"
                    onClick={() => setRating(star)}
                    style={{
                      color: star <= rating ? 'var(--warning)' : 'var(--border)',
                      transform: star <= rating ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-sm text-secondary mb-3 text-center">
                Tap a star to rate your driver. This helps us maintain quality service.
              </p>
              <div className="rating-actions w-full">
                <button
                  className="btn btn-primary w-full"
                  disabled={!rating || submittingRating}
                  onClick={handleRate}
                >
                  {submittingRating ? <div className="spinner" /> : 'Submit Rating'}
                </button>
              </div>
              <button 
                className="btn btn-ghost btn-sm mt-2 w-full" 
                onClick={() => { setShowRating(false); navigate('/history'); }}
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
