import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/assets/ui/logo.svg" alt="Underwater AI" className="footer-logo-img" />
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
        <div className="footer-credits">
          <p>© {new Date().getFullYear()} Underwater AI · Funded by MeitY, Government of India</p>
          <p className="footer-attribution">
            Printer product images courtesy of <a href="https://bambulab.com" target="_blank" rel="noopener noreferrer">Bambu Lab</a>.
            Underwater AI is an independent service — not affiliated with or endorsed by Bambu Lab.
          </p>
        </div>
        <p className="footer-tech">Powered by Bambu Lab P2S</p>
      </div>

      <style>{`
        .footer {
          background: var(--color-bg-secondary);
          border-top: 1px solid rgba(143, 174, 126, 0.06);
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
          margin-bottom: 12px;
        }
        .footer-logo-img {
          height: 40px;
          width: auto;
        }
        .footer-tagline {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-accent-sage);
          margin-bottom: 16px;
          letter-spacing: 0.02em;
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
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-primary);
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
        .footer-col a:hover { color: var(--color-accent-sage); }
        .footer-bottom {
          max-width: 1280px;
          margin: 48px auto 0;
          padding-top: 24px;
          border-top: 1px solid rgba(143, 174, 126, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .footer-credits { flex: 1; }
        .footer-credits p {
          font-size: 13px;
          color: var(--color-text-muted);
          margin: 0;
        }
        .footer-attribution {
          font-size: 11px !important;
          color: var(--color-text-muted) !important;
          opacity: 0.6;
          margin-top: 4px !important;
          max-width: 500px;
        }
        .footer-attribution a {
          color: var(--color-accent-sage);
          text-decoration: none;
        }
        .footer-attribution a:hover { text-decoration: underline; }
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
