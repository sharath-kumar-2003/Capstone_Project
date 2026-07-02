import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="page landing-page" style={{ overflowY: 'auto', display: 'block', paddingBottom: '4rem' }}>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <span className="navbar-brand">
          <span className="navbar-brand-accent">Ride</span>Share
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
            Become a Driver
          </a>
          {user ? (
            <Link id="btn-dashboard" to="/home" className="btn btn-primary btn-sm">
              Dashboard
            </Link>
          ) : (
            <Link id="btn-login-nav" to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="landing-hero">
        {/* Left Side */}
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <span className="landing-hero-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Now live in your city
          </span>
          <h1 className="landing-hero-title">
            Your ride,<br />redesigned.
          </h1>
          <p className="landing-hero-subtitle">
            Experience the next generation of real-time ridesharing. Set your pickup and dropoff, track your driver's route live, and reach your destination seamlessly.
          </p>
          <div className="landing-hero-actions">
            {user ? (
              <Link id="btn-cta-dashboard" to="/home" className="btn btn-primary">
                Book a Ride Now
              </Link>
            ) : (
              <>
                <Link id="btn-cta-rider" to="/login" className="btn btn-primary">
                  Request a Ride
                </Link>
                <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="btn btn-ghost">
                  Drive & Earn
                </a>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Interactive Live Tracking Mockup */}
        <div className="animate-in" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="landing-mock">
            {/* Header */}
            <div className="landing-mock-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="pulse-dot blue" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Live Route Tracking</span>
              </div>
              <span className="badge badge-in_progress">in progress</span>
            </div>

            {/* Simulated Map */}
            <div className="landing-mock-map">
              {/* Grid Background */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.4,
                backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }} />

              {/* Animated Road */}
              <svg width="100%" height="100%" viewBox="0 0 500 300" style={{ position: 'absolute', inset: 0 }}>
                <path d="M 50 150 Q 150 50 250 150 T 450 150" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
                <path d="M 50 150 Q 150 50 250 150 T 450 150" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 6" />
                <circle cx="50" cy="150" r="8" fill="#2563eb" />
                <circle cx="50" cy="150" r="14" fill="none" stroke="#2563eb" strokeWidth="1.5" style={{ animation: 'pulse-ring 2s infinite' }} />
                <circle cx="450" cy="150" r="8" fill="#059669" />
                <g style={{
                  offsetPath: `path('M 50 150 Q 150 50 250 150 T 450 150')`,
                  offsetRotate: 'auto',
                  animation: 'drive-car 8s infinite linear'
                }}>
                  <circle cx="0" cy="0" r="12" fill="#2563eb" opacity="0.15" />
                  <circle cx="0" cy="0" r="6" fill="#2563eb" />
                </g>
              </svg>
            </div>

            {/* Stats */}
            <div className="landing-mock-stats">
              <div>
                <p className="text-xs text-muted">Distance</p>
                <p className="fw-600">4.8 km</p>
              </div>
              <div>
                <p className="text-xs text-muted">Estimated Fare</p>
                <p className="fw-600" style={{ color: 'var(--accent)' }}>$8.26</p>
              </div>
              <div>
                <p className="text-xs text-muted">ETA</p>
                <p className="fw-600">6 mins</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Features Section ── */}
      <section className="landing-features" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-body)' }}>
        <h2 className="landing-features-title">
          Engineered for modern urban transit
        </h2>
        <div className="landing-features-grid">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="landing-feature-icon" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
            </div>
            <h3>Dynamic OSRM Routing</h3>
            <p className="text-sm text-secondary">
              No more straight lines. Our map engine calculates the real driving routes step-by-step so you know exactly where your driver is navigating.
            </p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="landing-feature-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>
            </div>
            <h3>Real-Time WebSockets</h3>
            <p className="text-sm text-secondary">
              Powered by Socket.io, vehicle location updates and ride state transitions are broadcast instantaneously for a lag-free experience.
            </p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="landing-feature-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </div>
            <h3>Lucrative Driving Portals</h3>
            <p className="text-sm text-secondary">
              Drivers gain a standalone interface with dynamic request handling, status step updates, and a comprehensive live earnings tracker.
            </p>
          </div>
        </div>
      </section>

      {/* ── Driver CTA banner ── */}
      <section className="landing-cta">
        <div className="landing-cta-card">
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Want to earn on your own terms?</h2>
            <p className="text-secondary" style={{ maxWidth: 560 }}>
              Become a driver on our network. Manage pending requests on your live dashboard, start and complete rides, and track your metrics.
            </p>
          </div>
          <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', borderRadius: 'var(--radius-md)' }}>
            Join as Driver →
          </a>
        </div>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes drive-car {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.6); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
