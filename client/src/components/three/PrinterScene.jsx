import { Suspense, useRef, useState, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL;

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
        src={`${BASE}assets/printer/hero/p2s-hero.jpg`}
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

function Scene3D() {
  return (
    <Canvas
      camera={{ position: [3, 2, 4], fov: 45 }}
      shadows
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow shadow-mapSize={1024} />
        <pointLight position={[2, 3, 2]} color="#8fae7e" intensity={1.5} />
        <pointLight position={[-3, 1, -2]} color="#c4a882" intensity={0.5} />

        <PrinterModel url={`${BASE}assets/printer/models/printer-google.glb`} />
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
  );
}

export default function PrinterScene() {
  const [use3D, setUse3D] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check device memory
    if (typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory < 4) {
      setUse3D(false);
      return;
    }
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setUse3D(false);
    } catch {
      setUse3D(false);
    }
  }, []);

  if (!use3D || hasError) return <LowPowerFallback />;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ErrorCatcher onError={() => setHasError(true)}>
        <Scene3D />
      </ErrorCatcher>
    </div>
  );
}

class ErrorCatcher extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
