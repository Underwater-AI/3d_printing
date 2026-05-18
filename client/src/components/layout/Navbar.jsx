import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/order', label: 'Order' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/assets', label: 'Free Assets' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/track', label: 'Track' },
  { path: '/about', label: 'About' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <img src="/assets/ui/logo.svg" alt="Underwater AI" className="logo-img" />
        </Link>

        <div className="navbar-links">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <Link to="/order" className="navbar-cta">
          Submit Print Job
        </Link>

        <button
          className="navbar-burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`burger-line ${mobileOpen ? 'open' : ''}`} />
          <span className={`burger-line ${mobileOpen ? 'open' : ''}`} />
          <span className={`burger-line ${mobileOpen ? 'open' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar-mobile"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link-mobile ${location.pathname === path ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link to="/order" className="nav-cta-mobile" onClick={() => setMobileOpen(false)}>
              Submit Print Job →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(26, 22, 18, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(143, 174, 126, 0.08);
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          height: 36px;
        }
        .logo-img {
          height: 36px;
          width: auto;
        }
        .navbar-links {
          display: flex;
          gap: 8px;
        }
        .nav-link {
          padding: 8px 14px;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.15s ease;
          letter-spacing: 0.01em;
        }
        .nav-link:hover {
          color: var(--color-text-primary);
          background: rgba(143, 174, 126, 0.06);
        }
        .nav-link.active {
          color: var(--color-accent-sage);
          background: rgba(143, 174, 126, 0.1);
        }
        .navbar-cta {
          padding: 8px 20px;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-inverse);
          background: var(--color-accent-sage);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.15s ease;
        }
        .navbar-cta:hover {
          background: #a0be8f;
          box-shadow: 0 0 20px rgba(143, 174, 126, 0.3);
        }
        .navbar-burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .burger-line {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--color-text-primary);
          transition: all 0.2s ease;
        }
        .burger-line.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .burger-line.open:nth-child(2) { opacity: 0; }
        .burger-line.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .navbar-mobile {
          display: flex;
          flex-direction: column;
          padding: 16px 24px;
          gap: 4px;
          background: rgba(26, 22, 18, 0.95);
          border-bottom: 1px solid rgba(143, 174, 126, 0.08);
        }
        .nav-link-mobile {
          padding: 12px 16px;
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--color-text-secondary);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.15s ease;
        }
        .nav-link-mobile:hover, .nav-link-mobile.active {
          color: var(--color-accent-sage);
          background: rgba(143, 174, 126, 0.06);
        }
        .nav-cta-mobile {
          margin-top: 8px;
          padding: 12px 16px;
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-text-inverse);
          background: var(--color-accent-sage);
          text-decoration: none;
          border-radius: 6px;
          text-align: center;
        }
        @media (max-width: 768px) {
          .navbar-links, .navbar-cta { display: none; }
          .navbar-burger { display: flex; }
        }
      `}</style>
    </nav>
  );
}
