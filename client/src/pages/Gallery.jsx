import { useState } from 'react';
import { motion } from 'framer-motion';

const BASE = import.meta.env.BASE_URL;

const galleryItems = [
  { id: 1, name: 'Precision Multi-Color Print', material: 'PLA+', color: 'Multi', category: 'Multicolor', desc: 'AMS-powered 4-color print with seamless transitions. Bambu Lab P2S precision.', image: `${BASE}assets/printer/gallery/p2s-gallery-1.jpg` },
  { id: 2, name: 'Functional Prototype', material: 'PETG', color: 'Black', category: 'Engineering', desc: 'Engineering-grade PETG with 0.2mm layer height. Heat resistant, durable.', image: `${BASE}assets/printer/gallery/p2s-gallery-2.jpg` },
  { id: 3, name: 'High-Detail Figurine', material: 'PLA', color: 'White', category: 'Art', desc: 'Ultra-fine 0.08mm layers for maximum detail. Smooth surface finish.', image: `${BASE}assets/printer/gallery/p2s-gallery-3.jpg` },
  { id: 4, name: 'Mechanical Assembly', material: 'PLA+', color: 'Grey', category: 'Engineering', desc: 'Multi-part assembly with snap-fit tolerances. Printed as a single job.', image: `${BASE}assets/printer/gallery/p2s-gallery-4.jpg` },
  { id: 5, name: 'Large Format Print', material: 'PLA', color: 'Orange', category: 'Consumer', desc: 'Full 256mm build volume utilization. Vase mode for speed.', image: `${BASE}assets/printer/gallery/p2s-gallery-5.jpg` },
  { id: 6, name: 'AI-Assisted Print Quality', material: 'PLA+', color: 'Blue', category: 'AI Features', desc: 'First-layer AI detection ensures perfect adhesion every time.', image: `${BASE}assets/printer/feature/ai-Ai-1-v1.jpg` },
  { id: 7, name: 'Spaghetti Detection', material: 'PLA', color: 'White', category: 'AI Features', desc: 'AI monitors for print failures and pauses automatically to save filament.', image: `${BASE}assets/printer/feature/ai-Ai-2.jpg` },
  { id: 8, name: 'Flow Calibration', material: 'PETG', color: 'Black', category: 'AI Features', desc: 'Automatic flow rate calibration for consistent extrusion.', image: `${BASE}assets/printer/feature/ai-Ai-3.jpg` },
  { id: 9, name: 'Vibration Compensation', material: 'PLA+', color: 'Grey', category: 'Engineering', desc: 'Input shaping eliminates ringing at high speeds.', image: `${BASE}assets/printer/feature/ai-Ai-4.jpg` },
  { id: 10, name: 'Speed Benchy — 18min', material: 'PLA', color: 'White', category: 'Speed', desc: '600mm/s max speed. 18-minute benchy with quality intact.', image: `${BASE}assets/printer/feature/highlight-1-en.jpg` },
  { id: 11, name: 'CoreXY Motion System', material: 'PLA+', color: 'Black', category: 'Speed', desc: 'Belt-driven CoreXY for precise, fast movements.', image: `${BASE}assets/printer/feature/highlight-2.jpg` },
  { id: 12, name: 'Active Flow Rate', material: 'PLA', color: 'White', category: 'Engineering', desc: 'Real-time flow rate adjustment for perfect extrusion.', image: `${BASE}assets/printer/feature/highlight-3.jpg` },
];

const categories = ['All', 'Engineering', 'Multicolor', 'AI Features', 'Speed', 'Art', 'Consumer'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div style={{ paddingTop: '100px', maxWidth: '1280px', margin: '0 auto', padding: '100px 40px 80px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '12px',
          color: 'var(--color-accent-sage)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Our Work
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 8px',
        }}>
          Print Gallery
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}>
          Real output from our Bambu Lab P2S — featuring AI-assisted quality and multi-color printing
        </p>
      </div>

      {/* Category filter */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '32px',
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              fontWeight: 500,
              color: activeCategory === cat ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
              background: activeCategory === cat ? 'var(--color-accent-sage)' : 'var(--color-bg-elevated)',
              border: activeCategory === cat ? 'none' : '1px solid rgba(143, 174, 126, 0.1)',
              borderRadius: '100px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px',
      }}>
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid rgba(143, 174, 126, 0.06)',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <div style={{
              height: '220px',
              background: 'var(--color-bg-secondary)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              />
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                margin: '0 0 6px',
              }}>
                {item.name}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
                margin: '0 0 12px',
              }}>
                {item.desc}
              </p>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  color: 'var(--color-accent-sage)',
                  padding: '2px 8px',
                  background: 'rgba(143, 174, 126, 0.08)',
                  borderRadius: '100px',
                }}>
                  {item.material}
                </span>
                <span style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  padding: '2px 8px',
                  background: 'var(--color-bg-elevated)',
                  borderRadius: '100px',
                }}>
                  {item.color}
                </span>
                <span style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  padding: '2px 8px',
                  background: 'var(--color-bg-elevated)',
                  borderRadius: '100px',
                }}>
                  {item.category}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bambu Lab Attribution */}
      <div style={{
        marginTop: '64px',
        padding: '24px',
        background: 'var(--color-bg-card)',
        border: '1px solid rgba(143, 174, 126, 0.06)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}>
        <img
          src={`${BASE}assets/printer/product/p2s-screen.jpg`}
          alt="Bambu Lab P2S touchscreen"
          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
        />
        <div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            margin: '0 0 4px',
            lineHeight: 1.5,
          }}>
            All prints produced on the <strong style={{ color: 'var(--color-text-primary)' }}>Bambu Lab P2S</strong>.
            Product images courtesy of Bambu Lab. Underwater AI is an independent service provider —
            not affiliated with or endorsed by Bambu Lab.
          </p>
          <a
            href="https://bambulab.com/en-in/p2s"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              color: 'var(--color-accent-sage)',
              textDecoration: 'none',
            }}
          >
            bambulab.com/en-in/p2s →
          </a>
        </div>
      </div>
    </div>
  );
}
