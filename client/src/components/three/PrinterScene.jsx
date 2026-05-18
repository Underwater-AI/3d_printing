import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function PrinterModel({ url }) {
  const { scene } = useGLTF(url);
  const ref = useRef();
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t.current * 0.3) * 0.035;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <primitive
        ref={ref}
        object={scene}
        scale={1}
        position={[0, -0.5, 0]}
        castShadow
        receiveShadow
      />
    </Float>
  );
}

function GridFloor() {
  return (
    <gridHelper
      args={[20, 40, '#8fae7e', '#1a1612']}
      position={[0, -1.5, 0]}
      material-transparent
      material-opacity={0.15}
    />
  );
}

function SceneLoader() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-primary)',
      borderRadius: '12px',
      zIndex: 5,
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: '2px solid rgba(143, 174, 126, 0.15)',
        borderTopColor: 'var(--color-accent-sage)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        marginBottom: 12,
      }} />
      <span style={{
        fontFamily: 'var(--font-label)',
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
      }}>
        Loading 3D Model
      </span>
    </div>
  );
}

function LowPowerFallback() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-primary)',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <img
        src="/assets/printer/hero/p2s-hero.jpg"
        alt="Bambu Lab P2S — the printer used by Underwater AI"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        fontFamily: 'var(--font-label)',
        fontSize: '10px',
        color: 'rgba(255,255,255,0.4)',
        background: 'rgba(0,0,0,0.6)',
        padding: '4px 8px',
        borderRadius: '4px',
      }}>
        Bambu Lab P2S
      </div>
    </div>
  );
}

export default function PrinterScene() {
  const [lowPower, setLowPower] = useState(false);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory < 4) {
      setLowPower(true);
      return;
    }
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setWebglOk(false);
    } catch {
      setWebglOk(false);
    }
  }, []);

  if (lowPower || !webglOk) return <LowPowerFallback />;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [3, 2, 4], fov: 45 }}
        shadows
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Stars radius={80} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />

          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow shadow-mapSize={1024} />
          <pointLight position={[2, 3, 2]} color="#8fae7e" intensity={1.5} />
          <pointLight position={[-3, 1, -2]} color="#c4a882" intensity={0.5} />

          <PrinterModel url="/assets/printer/models/printer-google.glb" />
          <GridFloor />

          <ContactShadows
            position={[0, -1.49, 0]}
            opacity={0.4}
            scale={8}
            blur={2}
            far={4}
            color="#0a0806"
          />

          <Environment preset="studio" environmentIntensity={0.3} />

          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2 + 0.3}
            minPolarAngle={0.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
