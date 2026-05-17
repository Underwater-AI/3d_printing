import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">◆</span>
            <span className="logo-text">Underwater AI</span>
          </div>
          <p className="footer-tagline">Precision 3D Printing · IISER Kolkata</p>
          <p className="footer-address">
            IISER Kolkata Campus, Mohanpur,<br />
            Nadia, West Bengal — 741246
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Service</h4>
            <Link to="/order">Submit Print Job</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/track">Track Order</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="https://underwater-ai.github.io/" target="_blank" rel="noopener noreferrer">Underwater AI</a>
            <Link to="/about">About Us</Link>
            <a href="https://underwater-ai.github.io/" target="_blank" rel="noopener noreferrer">Main Site</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Underwater AI · Funded by MeitY, Government of India</p>
        <p className="footer-tech">Powered by Bambu Lab P2S</p>
      </div>

      <style>{`
        .footer {
          background: var(--color-bg-secondary);
          border-top: 1px solid rgba(0, 212, 255, 0.06);
          padding: 64px 24px 32px;
          margin-top: 120px;
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 2fr;
          gap: 64px;
        }
        .footer-brand .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 20px;
          color: var(--color-text-primary);
          margin-bottom: 12px;
        }
        .footer-brand .logo-icon { color: var(--color-accent-cyan); }
        .footer-tagline {
          font-family: var(--font-label);
          font-size: 13px;
          color: var(--color-accent-cyan);
          margin-bottom: 16px;
          letter-spacing: 0.05em;
        }
        .footer-address {
          font-size: 14px;
          color: var(--color-text-muted);
          line-height: 1.6;
        }
        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .footer-col h4 {
          font-family: var(--font-label);
          font-size: 12px;
          font-weight: 500;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
        }
        .footer-col a {
          display: block;
          font-size: 14px;
          color: var(--color-text-secondary);
          text-decoration: none;
          padding: 4px 0;
          transition: color 0.15s ease;
        }
        .footer-col a:hover { color: var(--color-accent-cyan); }
        .footer-bottom {
          max-width: 1280px;
          margin: 48px auto 0;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 212, 255, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-bottom p {
          font-size: 13px;
          color: var(--color-text-muted);
        }
        .footer-tech {
          font-family: var(--font-label);
          font-size: 12px;
          color: var(--color-text-muted);
          opacity: 0.6;
        }
        @media (max-width: 768px) {
          .footer-inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .footer-links {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }
        @media (max-width: 480px) {
          .footer-links {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
