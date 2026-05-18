import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fitTextToWidth } from '../lib/pretext';
import { Reveal, StaggerContainer, StaggerItem, ScaleReveal } from '../components/ui/ScrollReveal';

const BASE = import.meta.env.BASE_URL;
const PrinterScene = lazy(() => import('../components/three/PrinterScene'));

const stats = [
  { value: '256³', unit: 'mm', label: 'Build Volume' },
  { value: '0.4', unit: 'mm', label: 'Nozzle Diameter' },
  { value: '600', unit: 'mm/s', label: 'Max Speed' },
  { value: 'AI', unit: '', label: 'Error Detection' },
];

const services = [
  { icon: '◇', name: 'PLA Standard', price: '₹2/g', desc: 'Most common filament. Great detail, low cost. Perfect for prototypes and decorative items.' },
  { icon: '◆', name: 'PLA+ Premium', price: '₹2.5/g', desc: 'Enhanced PLA with better layer adhesion and smoother surface finish.' },
  { icon: '⬡', name: 'ABS / ASA', price: '₹3.5/g', desc: 'Engineering-grade thermoplastics. Heat resistant, durable, outdoor-ready.' },
  { icon: '◎', name: 'TPU Flexible', price: '₹4/g', desc: 'Flexible, rubber-like material. Perfect for wearables, gaskets, and phone cases.' },
];

const steps = [
  { num: '01', title: 'Upload STL', desc: 'Drag & drop your .STL, .3MF, .OBJ, or .STEP file.' },
  { num: '02', title: 'Choose Material', desc: 'Select filament, color, quality, and infill settings.' },
  { num: '03', title: 'Pay Securely', desc: 'Razorpay checkout with UPI, cards, and net banking.' },
  { num: '04', title: 'We Print & Ship', desc: 'Printed on Bambu Lab P2S. Pickup or courier delivery.' },
];

function HeroHeading() {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState(72);

  useEffect(() => {
    function resize() {
      if (!ref.current) return;
      const container = ref.current.parentElement;
      if (!container) return;
      const available = container.clientWidth - 40;
      const ideal = fitTextToWidth('YOUR IDEA. PRINTED.', available, "'Cormorant Garamond', 'Georgia', serif", '700');
      setFontSize(Math.min(Math.max(ideal, 32), 96));
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: `${fontSize}px`,
        fontWeight: 700,
        lineHeight: 1.05,
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.02em',
        margin: 0,
      }}
    >
      YOUR IDEA.<br />
      <span className="text-gradient-sage">PRINTED.</span>
    </h1>
  );
}

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{
              fontFamily: 'var(--font-label)',
              fontSize: '13px',
              color: 'var(--color-accent-sage)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              Precision 3D Printing · IISER Kolkata
            </p>
            <HeroHeading />
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '17px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginTop: '20px',
              maxWidth: '480px',
            }}>
              Powered by Bambu Lab P2S · Upload your model, choose materials,
              and get precision prints delivered from IISER Kolkata Campus.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
              <Link to="/order" className="hero-cta-primary">
                Submit Print Job →
              </Link>
              <Link to="/gallery" className="hero-cta-secondary">
                View Gallery
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="hero-scene">
          <div className="hero-media-wrapper">
            <video
              className="hero-video"
              src={`${BASE}assets/printer/video/p2s-hero.mp4`}
              poster={`${BASE}assets/printer/hero/p2s-hero.jpg`}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="hero-media-overlay" />
          </div>
          <Suspense fallback={null}>
            <PrinterScene />
          </Suspense>
        </div>
      </section>

      {/* Stats bar */}
      <Reveal>
        <section className="stats-bar">
          {stats.map(({ value, unit, label }) => (
            <div key={label} className="stat-item">
              <span className="stat-value">{value}<span className="stat-unit">{unit}</span></span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </section>
      </Reveal>

      {/* Services */}
      <section className="section services-section">
        <Reveal>
          <h2 className="section-title">Materials & Services</h2>
          <p className="section-subtitle">Choose the right filament for your project</p>
        </Reveal>
        <StaggerContainer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {services.map(({ icon, name, price, desc }) => (
            <StaggerItem key={name}>
              <motion.div
                className="service-card"
                whileHover={{ y: -4, borderColor: 'rgba(143, 174, 126, 0.25)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="service-icon">{icon}</div>
                <h3 className="service-name">{name}</h3>
                <span className="service-price">{price}</span>
                <p className="service-desc">{desc}</p>
                <Link to="/order" className="service-link">Order Now →</Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* How it works */}
      <section className="section steps-section">
        <Reveal>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">From upload to delivery in 4 simple steps</p>
        </Reveal>
        <StaggerContainer className="steps-grid">
          {steps.map(({ num, title, desc }) => (
            <StaggerItem key={num}>
              <div className="step-card">
                <span className="step-num">{num}</span>
                <h3 className="step-title">{title}</h3>
                <p className="step-desc">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Printer showcase */}
      <section className="printer-showcase">
        <div className="printer-showcase-inner">
          <ScaleReveal>
            <div className="printer-showcase-image">
              <img src={`${BASE}assets/printer/feature/highlight-1-en.jpg`} alt="Bambu Lab P2S — the printer used by Underwater AI" />
            </div>
          </ScaleReveal>
          <Reveal delay={0.15}>
            <div className="printer-showcase-info">
              <p style={{
                fontFamily: 'var(--font-label)',
                fontSize: '12px',
                color: 'var(--color-accent-sage)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                Our Printer
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                margin: '0 0 16px',
                lineHeight: 1.2,
              }}>
                Bambu Lab P2S
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                marginBottom: '28px',
                maxWidth: '460px',
              }}>
                CoreXY motion system with 600mm/s max speed. AI-powered first-layer detection and
                spaghetti failure monitoring. Automatic flow calibration and vibration compensation
                for consistent, production-grade output.
              </p>
              <div className="printer-specs-grid">
                {[
                  { label: 'Build Volume', value: '256 × 256 × 256', unit: 'mm³' },
                  { label: 'Max Speed', value: '600', unit: 'mm/s' },
                  { label: 'Nozzle', value: '0.4', unit: 'mm' },
                  { label: 'Layer Resolution', value: '0.08 – 0.28', unit: 'mm' },
                  { label: 'AMS Support', value: '4', unit: 'colors' },
                  { label: 'AI Detection', value: 'Yes', unit: '' },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="printer-spec-item">
                    <span className="printer-spec-value">{value}<span className="printer-spec-unit">{unit}</span></span>
                    <span className="printer-spec-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About blurb */}
      <section className="section about-blurb">
        <Reveal>
          <div className="about-blurb-content">
            <p style={{
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              color: 'var(--color-accent-sage)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              About Underwater AI
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
              marginBottom: '16px',
            }}>
              Deep-Tech at IISER Kolkata
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              maxWidth: '600px',
              marginBottom: '24px',
            }}>
              We are a deep-tech startup based at IISER Kolkata Campus, Mohanpur, Nadia — funded by
              MeitY, Government of India. Our core product is AI-powered underwater imaging. Our 3D
              printing service powers rapid prototyping for our AUV/ROV hardware research, and we've
              opened it to the public.
            </p>
            <a
              href="https://underwater-ai.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link"
            >
              Visit Underwater AI →
            </a>
          </div>
        </Reveal>
      </section>

      {/* CTA Banner */}
      <Reveal>
        <section className="cta-banner">
          <div className="cta-banner-inner">
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              margin: '0 0 12px',
              lineHeight: 1.2,
            }}>
              Ready to bring your idea to life?
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              margin: '0 0 24px',
              maxWidth: '440px',
            }}>
              Upload your STL file, choose your material, and get a quote in seconds.
              Printed on Bambu Lab P2S with AI-assisted quality control.
            </p>
            <Link to="/order" className="hero-cta-primary">
              Start Your Print →
            </Link>
          </div>
        </section>
      </Reveal>

      <style>{`
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          padding: 120px 40px 80px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .hero-content { z-index: 1; }
        .hero-scene {
          height: 500px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }
        .hero-media-wrapper {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.25;
        }
        .hero-media-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 30%, var(--color-bg-primary) 80%);
        }
        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          padding: 14px 28px;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-inverse);
          background: var(--color-accent-sage);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .hero-cta-primary:hover {
          background: #a0be8f;
          box-shadow: 0 0 30px rgba(143, 174, 126, 0.3);
          transform: translateY(-1px);
        }
        .hero-cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 14px 28px;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-accent-sage);
          background: transparent;
          border: 1px solid rgba(143, 174, 126, 0.3);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .hero-cta-secondary:hover {
          background: rgba(143, 174, 126, 0.08);
          border-color: rgba(143, 174, 126, 0.5);
        }

        .stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(143, 174, 126, 0.06);
          border-top: 1px solid rgba(143, 174, 126, 0.06);
          border-bottom: 1px solid rgba(143, 174, 126, 0.06);
          max-width: 1280px;
          margin: 0 auto;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 24px 16px;
          background: var(--color-bg-primary);
        }
        .stat-value {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          color: var(--color-accent-sage);
        }
        .stat-unit {
          font-size: 14px;
          color: var(--color-text-muted);
          margin-left: 2px;
        }
        .stat-label {
          font-family: var(--font-label);
          font-size: 12px;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 100px 40px;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 8px;
        }
        .section-subtitle {
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--color-text-muted);
          margin: 0 0 48px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .service-card {
          padding: 28px;
          background: var(--color-bg-card);
          border: 1px solid rgba(143, 174, 126, 0.06);
          border-radius: 12px;
          transition: all 0.2s ease;
          height: 100%;
        }
        .service-icon {
          font-size: 28px;
          color: var(--color-accent-sage);
          margin-bottom: 16px;
        }
        .service-name {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 4px;
        }
        .service-price {
          font-family: var(--font-label);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-accent-sage);
        }
        .service-desc {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin: 12px 0 16px;
        }
        .service-link {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-accent-sage);
          text-decoration: none;
          transition: opacity 0.15s ease;
        }
        .service-link:hover { opacity: 0.8; }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .step-card {
          padding: 24px;
          background: var(--color-bg-card);
          border: 1px solid rgba(143, 174, 126, 0.06);
          border-radius: 12px;
          height: 100%;
        }
        .step-num {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: rgba(143, 174, 126, 0.15);
          display: block;
          margin-bottom: 12px;
        }
        .step-title {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 8px;
        }
        .step-desc {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .printer-showcase {
          background: var(--color-bg-secondary);
          border-top: 1px solid rgba(143, 174, 126, 0.06);
          border-bottom: 1px solid rgba(143, 174, 126, 0.06);
          padding: 80px 40px;
        }
        .printer-showcase-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 64px;
          align-items: center;
        }
        .printer-showcase-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .printer-showcase-image img {
          width: 100%;
          max-width: 480px;
          height: auto;
          border-radius: 12px;
          filter: drop-shadow(0 0 40px rgba(143, 174, 126, 0.1));
        }
        .printer-specs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .printer-spec-item {
          padding: 16px;
          background: var(--color-bg-card);
          border: 1px solid rgba(143, 174, 126, 0.06);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .printer-spec-value {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: var(--color-text-primary);
        }
        .printer-spec-unit {
          font-size: 12px;
          color: var(--color-text-muted);
          margin-left: 2px;
        }
        .printer-spec-label {
          font-family: var(--font-label);
          font-size: 11px;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .about-blurb {
          text-align: center;
          display: flex;
          justify-content: center;
        }
        .about-blurb-content {
          max-width: 600px;
        }
        .about-link {
          display: inline-flex;
          align-items: center;
          padding: 10px 20px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-accent-sage);
          background: transparent;
          border: 1px solid rgba(143, 174, 126, 0.3);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .about-link:hover {
          background: rgba(143, 174, 126, 0.08);
        }

        .cta-banner {
          background: var(--color-bg-secondary);
          border-top: 1px solid rgba(143, 174, 126, 0.06);
          padding: 80px 40px;
        }
        .cta-banner-inner {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @media (max-width: 768px) {
          .hero {
            grid-template-columns: 1fr;
            padding: 100px 24px 40px;
            min-height: auto;
          }
          .hero-scene {
            height: 350px;
            order: -1;
          }
          .stats-bar {
            grid-template-columns: repeat(2, 1fr);
          }
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .section {
            padding: 60px 24px;
          }
          .printer-showcase {
            padding: 60px 24px;
          }
          .printer-showcase-inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .printer-showcase-image {
            order: -1;
          }
          .printer-specs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .cta-banner {
            padding: 60px 24px;
          }
        }
        @media (max-width: 480px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }
          .printer-specs-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .printer-spec-item {
            padding: 12px;
          }
          .printer-spec-value {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
