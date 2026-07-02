import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="page landing-page" style={{ overflowY: 'auto', display: 'block', paddingBottom: '4rem' }}>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <span className="navbar-brand">
          <span className="navbar-brand-accent">Ride</span>Share <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Driver</span>
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
            Rider App
          </a>
          {user ? (
            <Link id="btn-dashboard" to="/dashboard" className="btn btn-primary btn-sm">
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Start earning today
          </span>
          <h1 className="landing-hero-title">
            Drive smart.<br />Earn more.
          </h1>
          <p className="landing-hero-subtitle">
            Join the RideShare network. Get real-time ride requests, navigate with precision, and track your earnings instantly.
          </p>
          <div className="landing-hero-actions">
            {user ? (
              <Link id="btn-cta-dashboard" to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link id="btn-cta-driver" to="/register" className="btn btn-primary">
                  Apply to Drive
                </Link>
                <Link to="/login" className="btn btn-ghost">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Dashboard Mockup */}
        <div className="animate-in" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="landing-mock">
            {/* Header */}
            <div className="landing-mock-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="toggle">
                  <input type="checkbox" checked readOnly />
                  <span className="slider"></span>
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Online</span>
              </div>
              <span className="pulse-dot emerald" />
            </div>

            {/* Simulated Request */}
            <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem', borderColor: 'var(--accent-border)', background: 'var(--accent-bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="text-sm fw-600 text-accent">New Request</span>
                <span className="text-sm fw-600">3 mins away</span>
              </div>
              <p className="text-xs text-muted mb-2">Downtown → Airport</p>
              <button className="btn btn-primary w-full btn-sm">Accept Ride</button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card" style={{ padding: '0.75rem' }}>
                <p className="stat-value" style={{ fontSize: '1.25rem' }}>$124</p>
                <p className="stat-label">Today</p>
              </div>
              <div className="stat-card" style={{ padding: '0.75rem' }}>
                <p className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>8</p>
                <p className="stat-label">Rides</p>
              </div>
              <div className="stat-card" style={{ padding: '0.75rem' }}>
                <p className="stat-value" style={{ fontSize: '1.25rem' }}>4.9</p>
                <p className="stat-label">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Features Section ── */}
      <section className="landing-features" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-body)' }}>
        <h2 className="landing-features-title">
          Tools built for professionals
        </h2>
        <div className="landing-features-grid">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="landing-feature-icon" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <h3>Instant Dispatch</h3>
            <p className="text-sm text-secondary">
              Receive ride requests immediately through WebSocket connections. Accept rides with a single tap and navigate seamlessly.
            </p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="landing-feature-icon" style={{ background: 'var(--teal-bg)', color: 'var(--teal)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>Real-time Earnings</h3>
            <p className="text-sm text-secondary">
              Track your daily and total earnings as soon as a ride completes. Full transparency on every fare and tip.
            </p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="landing-feature-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <h3>Reputation System</h3>
            <p className="text-sm text-secondary">
              Build your rating with every 5-star ride. High-rated drivers get priority dispatch and access to premium tiers.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
