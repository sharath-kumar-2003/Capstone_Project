import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rides/rider')
      .then((res) => setRides(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeRide = rides.find((r) => ['pending', 'accepted', 'in_progress'].includes(r.status));
  const pastRides = rides.filter((r) => ['completed', 'cancelled'].includes(r.status));

  return (
    <div className="page" style={{ paddingBottom: '2rem' }}>
      <nav className="navbar">
        <span className="navbar-brand">
          <span className="navbar-brand-accent">Ride</span> History
        </span>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/home')}>
          Back to Home
        </button>
      </nav>

      <div className="history-content container">
        {activeRide && (
          <div className="history-active-banner animate-in" onClick={() => navigate('/active', { state: { ride: activeRide } })}>
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-1 mb-1">
                <span className="pulse-dot blue"></span>
                <span className="text-sm fw-600 text-accent">Active Ride</span>
              </div>
              <p className="fw-600">{activeRide.pickup.address} → {activeRide.dropoff.address}</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        )}

        <div className="history-header">
          <h2>Past Rides</h2>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading your history…</p>
          </div>
        ) : pastRides.length === 0 ? (
          <div className="empty-state animate-in">
            <div className="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <p className="fw-600">No rides yet</p>
            <p className="text-sm text-secondary">Your completed and cancelled rides will appear here.</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/home')}>
              Book a Ride
            </button>
          </div>
        ) : (
          <div className="history-list">
            {pastRides.map((ride) => {
              const date = new Date(ride.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              });
              return (
                <div key={ride._id} className="ride-card animate-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs fw-500 text-muted">{date}</span>
                    <span className={`badge badge-${ride.status}`}>
                      {ride.status}
                    </span>
                  </div>

                  <div className="ride-route mb-2">
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

                  <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="flex-col">
                      <span className="text-xs text-muted">Fare</span>
                      <span className="fw-600 text-accent">${ride.fare}</span>
                    </div>
                    {ride.driver && (
                      <div className="flex-col" style={{ textAlign: 'right' }}>
                        <span className="text-xs text-muted">Driver</span>
                        <span className="fw-500">{ride.driver.username}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
