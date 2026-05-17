import { useState } from 'react';
import { motion } from 'framer-motion';

const galleryItems = [
  { id: 1, name: 'Mechanical Gear Set', material: 'PLA+', color: 'Grey', category: 'Engineering' },
  { id: 2, name: 'Phone Case', material: 'TPU', color: 'Black', category: 'Consumer' },
  { id: 3, name: 'Architectural Model', material: 'PLA', color: 'White', category: 'Architecture' },
  { id: 4, name: 'Drone Frame', material: 'PA-CF', color: 'Black', category: 'Aerospace' },
  { id: 5, name: 'Vase — Spiral', material: 'PLA', color: 'Blue', category: 'Art' },
  { id: 6, name: 'Robot Arm Joint', material: 'PETG', color: 'Orange', category: 'Robotics' },
  { id: 7, name: 'Jewelry Display', material: 'PLA', color: 'White', category: 'Retail' },
  { id: 8, name: 'Underwater Sensor Housing', material: 'PETG', color: 'Grey', category: 'Marine' },
];

const categories = ['All', 'Engineering', 'Consumer', 'Architecture', 'Aerospace', 'Art', 'Robotics', 'Marine'];

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
          color: 'var(--color-accent-cyan)',
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
          Examples of prints produced on our Bambu Lab P2S
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
              color: activeCategory === cat ? '#000814' : 'var(--color-text-secondary)',
              background: activeCategory === cat ? 'var(--color-accent-cyan)' : 'var(--color-bg-elevated)',
              border: activeCategory === cat ? 'none' : '1px solid rgba(0, 212, 255, 0.1)',
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
              border: '1px solid rgba(0, 212, 255, 0.06)',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {/* Placeholder image area */}
            <div style={{
              height: '200px',
              background: `linear-gradient(135deg, var(--color-bg-elevated), var(--color-bg-secondary))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontSize: '48px',
                opacity: 0.3,
                color: 'var(--color-accent-cyan)',
              }}>
                ◇
              </span>
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                margin: '0 0 8px',
              }}>
                {item.name}
              </h3>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  color: 'var(--color-accent-cyan)',
                  padding: '2px 8px',
                  background: 'rgba(0, 212, 255, 0.08)',
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
    </div>
  );
}
