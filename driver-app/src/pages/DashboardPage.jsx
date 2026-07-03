import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { getSocket } from '../socket';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('offline');
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalEarnings: 0, totalRides: 0, rating: 5 });

  useEffect(() => {
    // Initial fetch
    Promise.all([api.get('/drivers/me'), api.get('/rides/pending')])
      .then(([meRes, ridesRes]) => {
        setStatus(meRes.data.status);
        setStats({
          totalEarnings: meRes.data.totalEarnings,
          totalRides: meRes.data.totalRides,
          rating: meRes.data.rating,
        });
        setRequests(ridesRes.data);
      })
      .catch(() => {});

    // Socket listeners
    const socket = getSocket();
    const onNewRide = (ride) => {
      setRequests((prev) => [ride, ...prev.filter((r) => r._id !== ride._id)]);
    };
    const onRideCancelled = ({ rideId }) => {
      setRequests((prev) => prev.filter((r) => r._id !== rideId));
    };
    const onRideAccepted = ({ rideId }) => {
      setRequests((prev) => prev.filter((r) => r._id !== rideId));
    };

    socket.on('ride:new', onNewRide);
    socket.on('ride:cancelled', onRideCancelled);
    socket.on('ride:accepted', onRideAccepted);

    return () => {
      socket.off('ride:new', onNewRide);
      socket.off('ride:cancelled', onRideCancelled);
      socket.off('ride:accepted', onRideAccepted);
    };
  }, []);

  const toggleStatus = async () => {
    const next = status === 'online' ? 'offline' : 'online';
    try {
      await api.patch('/drivers/status', { status: next });
      setStatus(next);
    } catch {
      alert('Failed to update status');
    }
  };

  const acceptRide = async (rideId) => {
    try {
      const { data } = await api.patch(`/rides/${rideId}/status`, { status: 'accepted' });
      navigate('/active', { state: { ride: data } });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to accept ride');
      setRequests((prev) => prev.filter((r) => r._id !== rideId));
    }
  };

  return (
    <div className="page" style={{ paddingBottom: '80px' }}>
      <nav className="navbar">
        <span className="navbar-brand">
          <span className="navbar-brand-accent">Ride</span>Share <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Driver</span>
        </span>
        <div className="navbar-user">
          <span className="text-sm fw-500">{user?.username}</span>
          <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <button id="btn-logout" className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Top Status Card */}
        <div className="card dashboard-status-card animate-in">
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Current Status</h2>
            <p className="text-sm text-secondary">
              {status === 'online' ? 'You are receiving ride requests.' : 'Go online to start earning.'}
            </p>
          </div>
          <div className="toggle-wrap">
            <label className="toggle">
              <input
                id="toggle-status"
                type="checkbox"
                checked={status === 'online'}
                onChange={toggleStatus}
              />
              <span className="slider"></span>
            </label>
            <span className={`text-sm fw-600 ${status === 'online' ? 'text-accent' : 'text-muted'}`}>
              {status === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="stats-grid animate-in" style={{ animationDelay: '50ms' }}>
          <div className="stat-card">
            <p className="stat-value text-accent">${stats.totalEarnings.toFixed(2)}</p>
            <p className="stat-label">Earnings</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{stats.totalRides}</p>
            <p className="stat-label">Total Rides</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">⭐ {stats.rating.toFixed(1)}</p>
            <p className="stat-label">Rating</p>
          </div>
        </div>

        {/* Ride Requests */}
        <div className="mt-2 animate-in" style={{ animationDelay: '100ms' }}>
          <div className="dashboard-rides-header">
            <h3>Available Requests</h3>
            {status === 'online' && (
              <span className="badge badge-in_progress">
                <span className="pulse-dot emerald" style={{ marginRight: '0.25rem', display: 'inline-block' }}></span>
                Searching
              </span>
            )}
          </div>

          {status === 'offline' ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p className="fw-600 text-muted">You are currently offline</p>
              <p className="text-sm text-secondary">Toggle your status to online to start receiving ride requests in your area.</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <p className="fw-600 text-muted">No requests right now</p>
              <p className="text-sm text-secondary">We&apos;ll notify you when a rider nearby requests a trip.</p>
            </div>
          ) : (
            <div className="flex-col gap-2">
              {requests.map((r) => (
                <div key={r._id} className="ride-request-card">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted">Requested just now</span>
                    <span className="fw-700 text-accent" style={{ fontSize: '1.25rem' }}>${r.fare}</span>
                  </div>
                  
                  <div className="ride-route">
                    <div style={{ position: 'relative' }}>
                      <div className="route-dot" style={{ top: 4 }} />
                      <p className="route-label">Pickup</p>
                      <p className="route-address">{r.pickup.address}</p>
                    </div>
                    <div style={{ position: 'relative', marginTop: '0.75rem' }}>
                      <div className="route-dot end" style={{ bottom: 'auto', top: 4 }} />
                      <p className="route-label">Dropoff</p>
                      <p className="route-address">{r.dropoff.address}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mt-1">
                    <div className="flex-col" style={{ flex: 1 }}>
                      <span className="text-xs text-muted">Distance</span>
                      <span className="fw-600">{r.distance} km</span>
                    </div>
                    <div className="flex-col" style={{ flex: 1 }}>
                      <span className="text-xs text-muted">Rider</span>
                      <span className="fw-600">{r.rider?.username || 'Unknown'}</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-full mt-1"
                    onClick={() => acceptRide(r._id)}
                  >
                    Accept Ride
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bottom-nav">
        <button className="bottom-nav-item active" onClick={() => navigate('/dashboard')}>
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
