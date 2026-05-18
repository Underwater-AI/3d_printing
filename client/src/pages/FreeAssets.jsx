import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

const BASE = import.meta.env.BASE_URL;

const models = [
  {
    id: 'cubesat',
    name: 'CubeSat',
    category: 'Space',
    description: 'A CubeSat satellite model — 3 printable sections (top, middle, bottom). Perfect for space enthusiasts and education.',
    files: [
      { name: 'Top', file: BASE + 'assets/free-models/nasa/cubesat/CubeSat-top.stl' },
      { name: 'Middle', file: BASE + 'assets/free-models/nasa/cubesat/CubeSat-middle.stl' },
      { name: 'Bottom', file: BASE + 'assets/free-models/nasa/cubesat/CubeSat-bottom.stl' },
    ],
    preview: BASE + 'assets/free-models/nasa/cubesat/CubeSat.png',
    source: 'NASA 3D Resources',
    license: 'Public Domain',
    printTime: '~4 hours',
    difficulty: 'Easy',
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    category: 'Space',
    description: 'The iconic Hubble Space Telescope — detailed model with main body and solar panels. A stunning display piece.',
    files: [
      { name: 'Main Body', file: BASE + 'assets/free-models/nasa/hubble/Main-body.stl' },
      { name: 'Solar Panels', file: BASE + 'assets/free-models/nasa/hubble/Solar-panels.stl' },
    ],
    preview: BASE + 'assets/free-models/nasa/hubble/Hubble.png',
    source: 'NASA 3D Resources',
    license: 'Public Domain',
    printTime: '~8 hours',
    difficulty: 'Medium',
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    category: 'Space',
    description: 'The next-generation space telescope — featuring the iconic gold mirror dish and body. A masterpiece of engineering.',
    files: [
      { name: 'Body', file: BASE + 'assets/free-models/nasa/jwst/Body.stl' },
      { name: 'Dish', file: BASE + 'assets/free-models/nasa/jwst/Dish.stl' },
    ],
    preview: BASE + 'assets/free-models/nasa/jwst/James%20Webb%20Space%20Telescope.png',
    source: 'NASA 3D Resources',
    license: 'Public Domain',
    printTime: '~6 hours',
    difficulty: 'Medium',
  },
  {
    id: 'curiosity',
    name: 'Curiosity Rover',
    category: 'Space',
    description: 'The Mars Curiosity Rover — detailed model with body and wheels. Includes build instructions for assembly.',
    files: [
      { name: 'Body', file: BASE + 'assets/free-models/nasa/curiosity/1-body.stl' },
      { name: 'Wheels', file: BASE + 'assets/free-models/nasa/curiosity/4-wheels.stl' },
    ],
    preview: BASE + 'assets/free-models/nasa/curiosity/Curiosity%20Rover%20%28Detailed%29.png',
    source: 'NASA 3D Resources',
    license: 'Public Domain',
    printTime: '~12 hours',
    difficulty: 'Advanced',
  },
  {
    id: 'orion',
    name: 'Orion Capsule',
    category: 'Space',
    description: 'The Orion crew capsule — NASA\'s next-generation spacecraft for deep space missions. Clean, printable design.',
    files: [
      { name: 'Capsule', file: BASE + 'assets/free-models/nasa/orion/Orion-Capsule.stl' },
    ],
    preview: BASE + 'assets/free-models/nasa/orion/Orion.png',
    source: 'NASA 3D Resources',
    license: 'Public Domain',
    printTime: '~5 hours',
    difficulty: 'Easy',
  },
];

const categories = ['All', ...new Set(models.map(m => m.category))];

function ModelCard({ model }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="model-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-bg-card)',
        border: hovered ? '1px solid rgba(143, 174, 126, 0.3)' : '1px solid rgba(143, 174, 126, 0.06)',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 12px 40px rgba(10, 8, 6, 0.5)' : 'none',
      }}
    >
      {/* Preview */}
      <div style={{
        height: '280px',
        background: 'var(--color-bg-elevated)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {model.preview ? (
          <img
            src={model.preview}
            alt={model.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              padding: '20px',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{
            fontSize: '48px',
            opacity: 0.3,
          }}>
            {model.category === 'Space' ? '🛰️' : '🔧'}
          </div>
        )}

        {/* Category badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          fontFamily: 'var(--font-label)',
          fontSize: '11px',
          fontWeight: 500,
          color: 'var(--color-accent-sage)',
          background: 'rgba(143, 174, 126, 0.1)',
          border: '1px solid rgba(143, 174, 126, 0.2)',
          borderRadius: '20px',
          padding: '4px 10px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {model.category}
        </div>

        {/* Difficulty badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          fontFamily: 'var(--font-label)',
          fontSize: '11px',
          fontWeight: 500,
          color: model.difficulty === 'Easy' ? 'var(--color-success)' :
                 model.difficulty === 'Medium' ? 'var(--color-warning)' : 'var(--color-error)',
          background: model.difficulty === 'Easy' ? 'rgba(126, 184, 126, 0.1)' :
                      model.difficulty === 'Medium' ? 'rgba(212, 168, 83, 0.1)' : 'rgba(196, 107, 94, 0.1)',
          border: `1px solid ${model.difficulty === 'Easy' ? 'rgba(126, 184, 126, 0.2)' :
                               model.difficulty === 'Medium' ? 'rgba(212, 168, 83, 0.2)' : 'rgba(196, 107, 94, 0.2)'}`,
          borderRadius: '20px',
          padding: '4px 10px',
          letterSpacing: '0.05em',
        }}>
          {model.difficulty}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '24px' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: '8px',
          lineHeight: 1.2,
        }}>
          {model.name}
        </h3>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          marginBottom: '16px',
        }}>
          {model.description}
        </p>

        {/* Meta */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '20px',
          fontFamily: 'var(--font-label)',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
        }}>
          <span>⏱ {model.printTime}</span>
          <span>📄 {model.files.length} file{model.files.length > 1 ? 's' : ''}</span>
          <span>📋 {model.license}</span>
        </div>

        {/* Source */}
        <div style={{
          fontFamily: 'var(--font-label)',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          marginBottom: '16px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Source: {model.source}
        </div>

        {/* Download buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          {model.files.map(({ name, file }) => (
            <a
              key={name}
              href={file}
              download
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-text-inverse)',
                background: 'var(--color-accent-sage)',
                padding: '8px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#a0be8f';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(143, 174, 126, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--color-accent-sage)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ↓ {name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FreeAssets() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? models
    : models.filter(m => m.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px' }}>
      {/* Header */}
      <section style={{
        textAlign: 'center',
        padding: '0 var(--container-padding) 60px',
      }}>
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '12px',
          color: 'var(--color-accent-sage)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          Open Source · Free to Download · Ready to Print
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-5xl)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          lineHeight: 1.05,
          marginBottom: '16px',
        }}>
          Free Assets to Print
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-lg)',
          color: 'var(--color-text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Curated collection of open-source 3D printable models. Download STL files,
          slice them, and bring them to life on our Bambu Lab P2S.
        </p>
      </section>

      {/* Category filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '48px',
        flexWrap: 'wrap',
        padding: '0 var(--container-padding)',
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 500,
              color: activeCategory === cat ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
              background: activeCategory === cat ? 'var(--color-accent-sage)' : 'var(--color-bg-card)',
              border: activeCategory === cat ? 'none' : '1px solid rgba(143, 174, 126, 0.1)',
              padding: '8px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Models grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '24px',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 var(--container-padding) 80px',
      }}>
        {filtered.map(model => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>

      {/* CTA */}
      <section style={{
        textAlign: 'center',
        padding: '60px var(--container-padding)',
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid rgba(143, 174, 126, 0.06)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '12px',
        }}>
          Want to print your own design?
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-secondary)',
          marginBottom: '24px',
        }}>
          Upload your STL file and we'll print it on our Bambu Lab P2S
        </p>
        <a
          href="/order"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--color-text-inverse)',
            background: 'var(--color-accent-sage)',
            padding: '14px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            display: 'inline-block',
          }}
        >
          Submit Print Job →
        </a>
      </section>
    </div>
  );
}
