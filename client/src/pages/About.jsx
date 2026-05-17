import { motion } from 'framer-motion';

const team = [
  { name: 'Gautam Singh', role: 'CEO', initials: 'GS' },
  { name: 'Shuvam Banerji Seal', role: 'CTO', initials: 'SB' },
  { name: 'Youktik Sajjan', role: 'COO', initials: 'YS' },
  { name: 'Aman Kumar', role: 'CPO', initials: 'AK' },
];

export default function About() {
  return (
    <div style={{ paddingTop: '100px', maxWidth: '900px', margin: '0 auto', padding: '100px 24px 80px' }}>
      <div style={{ marginBottom: '48px' }}>
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '12px',
          color: 'var(--color-accent-cyan)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          About
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 16px',
        }}>
          Underwater AI
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.7,
          maxWidth: '700px',
        }}>
          We are a deep-tech startup based at IISER Kolkata Campus, Mohanpur, Nadia, West Bengal —
          funded by MeitY, Government of India. Our core product is AI-powered underwater imaging
          for marine research and autonomous underwater vehicles.
        </p>
      </div>

      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid rgba(0, 212, 255, 0.08)',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '48px',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          color: 'var(--color-text-primary)',
          margin: '0 0 16px',
        }}>
          Why 3D Printing?
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.7,
        }}>
          Our AUV and ROV hardware research demands rapid prototyping. We've built a professional-grade
          printing lab powered by the Bambu Lab P2S to support our internal R&D, and we've opened it
          to the IISER community and beyond. Whether you're a student, researcher, or startup — we can
          print your designs with precision.
        </p>
      </div>

      {/* Team */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        color: 'var(--color-text-primary)',
        margin: '0 0 24px',
      }}>
        Team
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '48px',
      }}>
        {team.map(({ name, role, initials }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid rgba(0, 212, 255, 0.06)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--color-accent-cyan)',
              margin: '0 auto 12px',
            }}>
              {initials}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              margin: '0 0 2px',
            }}>
              {name}
            </h3>
            <p style={{
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              color: 'var(--color-accent-cyan)',
              margin: 0,
            }}>
              {role} · BS-MS, IISER Kolkata
            </p>
          </motion.div>
        ))}
      </div>

      {/* Location */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        color: 'var(--color-text-primary)',
        margin: '0 0 16px',
      }}>
        Location
      </h2>
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid rgba(0, 212, 255, 0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '32px',
      }}>
        <div style={{
          height: '300px',
          background: 'var(--color-bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <iframe
            title="IISER Kolkata Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.5!2d88.52!3d22.96!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU3JzM2LjAiTiA4OMKwMzEnMTIuMCJF!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg) brightness(0.95) contrast(1.1)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div style={{ padding: '20px' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}>
            IISER Kolkata Campus, Mohanpur, Nadia, West Bengal — 741246
          </p>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '24px',
      }}>
        <a
          href="https://underwater-ai.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            fontFamily: 'var(--font-label)',
            fontSize: '14px',
            fontWeight: 500,
            color: '#000814',
            background: 'var(--color-accent-cyan)',
            textDecoration: 'none',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          Visit Underwater AI →
        </a>
      </div>
    </div>
  );
}
