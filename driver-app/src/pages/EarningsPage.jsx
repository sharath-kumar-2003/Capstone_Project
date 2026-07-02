import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function EarningsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/rides/driver'), api.get('/drivers/me')])
      .then(([ridesRes, profRes]) => {
        setRides(ridesRes.data);
        setProfile(profRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const completed = rides.filter((r) => r.status === 'completed');
  const todayEarnings = completed
    .filter((r) => {
      const d = new Date(r.completedAt || r.updatedAt);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    })
    .reduce((s, r) => s + r.fare, 0);

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      <nav className="navbar">
        <span className="navbar-brand">
          <span className="navbar-brand-accent">Driver</span> Earnings
        </span>
        <div className="navbar-user">
          <span className="text-sm fw-500">{user?.username}</span>
          <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <button id="btn-logout" className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="earnings-content">
        <h2>Your Earnings</h2>

        {/* Summary cards */}
        {profile && (
          <div className="earnings-grid">
            <div className="card earnings-summary-card animate-in">
              <p className="earnings-summary-value text-accent">
                ${profile.totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-muted mt-1">Total Earnings</p>
            </div>
            <div className="card earnings-summary-card animate-in" style={{ animationDelay: '50ms' }}>
              <p className="earnings-summary-value">
                ${todayEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-muted mt-1">Today</p>
            </div>
            <div className="card earnings-summary-card animate-in" style={{ animationDelay: '100ms' }}>
              <p className="earnings-summary-value">
                {profile.totalRides}
              </p>
              <p className="text-xs text-muted mt-1">Total Rides</p>
            </div>
            <div className="card earnings-summary-card animate-in" style={{ animationDelay: '150ms' }}>
              <p className="earnings-summary-value">
                ⭐ {profile.rating.toFixed(1)}
              </p>
              <p className="text-xs text-muted mt-1">Rating</p>
            </div>
          </div>
        )}

        {/* Ride history */}
        <div>
          <h3 className="mb-2">Completed Rides</h3>

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading history…</p>
            </div>
          )}

          {!loading && completed.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
              </div>
              <p className="fw-600">No completed rides yet</p>
              <p className="text-sm text-secondary">Start accepting rides to see your earnings here.</p>
            </div>
          )}

          <div className="earnings-history-list">
            {completed.map((ride) => {
              const date = new Date(ride.completedAt || ride.updatedAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              });
              return (
                <div key={ride._id} className="card earnings-history-item animate-in">
                  <div className="earnings-history-row">
                    <div>
                      <p className="text-xs text-muted mb-1">{date}</p>
                      <p className="fw-600">
                        {ride.rider?.username || 'Unknown Rider'}
                      </p>
                      <p className="text-sm text-secondary mt-1">
                        {ride.distance} km · {ride.pickup.address} → {ride.dropoff.address}
                      </p>
                    </div>
                    <p className="fw-700 text-accent" style={{ fontSize: '1.25rem', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                      +${ride.fare}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <button className="bottom-nav-item" onClick={() => navigate('/dashboard')}>
          <span className="bottom-nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </span>
          Dashboard
        </button>
        <button className="bottom-nav-item active" onClick={() => navigate('/earnings')}>
          <span className="bottom-nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </span>
          Earnings
        </button>
      </div>
    </div>
  );
}
