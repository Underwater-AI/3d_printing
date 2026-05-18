import { motion } from 'framer-motion';

const materials = [
  { id: 'PLA', name: 'PLA Standard', price: '₹2/g', desc: 'Most common. Good detail.', icon: '◇' },
  { id: 'PLA+', name: 'PLA+ Premium', price: '₹2.5/g', desc: 'Stronger, smoother finish.', icon: '◆' },
  { id: 'PETG', name: 'PETG', price: '₹3/g', desc: 'Durable, food-safe.', icon: '◈' },
  { id: 'ABS', name: 'ABS / ASA', price: '₹3.5/g', desc: 'Engineering grade, outdoor.', icon: '⬡' },
  { id: 'TPU', name: 'TPU 95A', price: '₹4/g', desc: 'Flexible, rubbery.', icon: '◎' },
  { id: 'PA-CF', name: 'Carbon Fiber', price: '₹8/g', desc: 'Ultra-stiff, aerospace.', icon: '⬢' },
];

const colors = [
  { name: 'White', hex: '#f0f0f0' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Grey', hex: '#888888' },
  { name: 'Red', hex: '#e63946' },
  { name: 'Blue', hex: '#457b9d' },
  { name: 'Green', hex: '#2a9d8f' },
  { name: 'Yellow', hex: '#e9c46a' },
  { name: 'Orange', hex: '#f4a261' },
];

export default function MaterialSelector({ selected, onSelect, color, onColorChange }) {
  return (
    <div className="material-selector">
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-label)',
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '12px',
      }}>
        Material
      </label>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '10px',
        marginBottom: '24px',
      }}>
        {materials.map((mat) => (
          <motion.button
            key={mat.id}
            onClick={() => onSelect(mat.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '6px',
              padding: '14px 16px',
              background: selected === mat.id ? 'rgba(143, 174, 126, 0.08)' : 'var(--color-bg-elevated)',
              border: selected === mat.id ? '1px solid rgba(143, 174, 126, 0.3)' : '1px solid rgba(143, 174, 126, 0.06)',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
              <span style={{
                fontSize: '18px',
                color: selected === mat.id ? 'var(--color-accent-sage)' : 'var(--color-text-muted)',
              }}>
                {mat.icon}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                color: selected === mat.id ? 'var(--color-accent-sage)' : 'var(--color-text-primary)',
              }}>
                {mat.name}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span style={{
                fontFamily: 'var(--font-label)',
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}>
                {mat.desc}
              </span>
              <span style={{
                fontFamily: 'var(--font-label)',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--color-accent-sage)',
              }}>
                {mat.price}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <label style={{
        display: 'block',
        fontFamily: 'var(--font-label)',
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '12px',
      }}>
        Color
      </label>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {colors.map((c) => (
          <motion.button
            key={c.name}
            onClick={() => onColorChange(c.name)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={c.name}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: c.hex,
              border: color === c.name ? '2px solid var(--color-accent-sage)' : '2px solid rgba(143, 174, 126, 0.1)',
              cursor: 'pointer',
              boxShadow: color === c.name ? '0 0 12px rgba(143, 174, 126, 0.3)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
