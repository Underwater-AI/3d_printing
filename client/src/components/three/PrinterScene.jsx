import { Suspense, useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Procedural PEI texture as a DataTexture
function usePEITexture() {
  return useMemo(() => {
    const size = 128;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        // Brownish metallic with fine grain
        const noise = Math.random() * 20 - 10;
        const base = 58 + noise;
        data[i] = base + 10;     // R
        data[i + 1] = base - 5;  // G
        data[i + 2] = base - 20; // B
        data[i + 3] = 255;       // A
      }
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

// Procedural brushed metal texture for chassis
function useBrushedMetalTexture() {
  return useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        // Horizontal brushing pattern
        const brush = Math.sin(y * 0.5 + Math.random() * 0.5) * 8;
        const base = 26 + brush;
        data[i] = base;
        data[i + 1] = base;
        data[i + 2] = base;
        data[i + 3] = 255;
      }
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

function P2SPrinter() {
  const groupRef = useRef();
  const headRef = useRef();
  const nozzleGlowRef = useRef();
  const fanBladeRef = useRef();
  const t = useRef(0);
  const peiTex = usePEITexture();
  const metalTex = useBrushedMetalTexture();

  useFrame((_, delta) => {
    t.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t.current * 0.3) * 0.035;
    }
    if (headRef.current) {
      headRef.current.position.x = Math.sin(t.current * 1.2) * 0.8;
    }
    if (nozzleGlowRef.current) {
      nozzleGlowRef.current.intensity = 2.5 + Math.sin(t.current * 4) * 0.5;
    }
    if (fanBladeRef.current) {
      fanBladeRef.current.rotation.z += delta * 15;
    }
  });

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#88aacc',
    transmission: 0.85,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.35,
    envMapIntensity: 0.8,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }), []);

  const chassisMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: metalTex,
    color: '#1a1a1a',
    metalness: 0.6,
    roughness: 0.4,
    envMapIntensity: 0.5,
  }), [metalTex]);

  const peiMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: peiTex,
    metalness: 0.3,
    roughness: 0.7,
    envMapIntensity: 0.3,
  }), [peiTex]);

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Main chassis */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow material={chassisMaterial}>
          <boxGeometry args={[1.96, 2.39, 2.03]} />
        </mesh>

        {/* Top panel */}
        <mesh position={[0, 1.21, 0]}>
          <boxGeometry args={[1.98, 0.04, 2.05]} />
          <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Front glass */}
        <mesh position={[0, 0, 1.02]} material={glassMaterial}>
          <boxGeometry args={[1.9, 2.3, 0.04]} />
        </mesh>

        {/* Build plate */}
        <mesh position={[0, -0.7, 0]} receiveShadow material={peiMaterial}>
          <boxGeometry args={[1.28, 0.05, 1.28]} />
        </mesh>

        {/* Toolhead rail */}
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 2.0, 8]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Second rail */}
        <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 2.0, 8]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Toolhead */}
        <group ref={headRef} position={[0, 0.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.2, 0.15]} />
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Nozzle */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.015, 0.008, 0.06, 8]} />
            <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Nozzle glow with ref for pulsing */}
          <pointLight ref={nozzleGlowRef} color="#ff6b35" intensity={2.5} distance={0.6} position={[0, -0.15, 0]} />
          {/* Hotend indicator */}
          <mesh position={[0, -0.05, 0.08]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={2} />
          </mesh>
          {/* Cooling fan housing */}
          <mesh position={[0, 0.02, -0.08]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Fan blades */}
          <group ref={fanBladeRef} position={[0, 0.02, -0.08]}>
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <mesh key={angle} rotation={[Math.PI / 2, 0, (angle * Math.PI) / 180]}>
                <boxGeometry args={[0.04, 0.005, 0.008]} />
                <meshStandardMaterial color="#333" metalness={0.3} roughness={0.5} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Spool holder arm */}
        <mesh position={[-1.1, 0.8, -0.5]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-1.1, 1.05, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Spool holder ring */}
        <mesh position={[-1.1, 0.8, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.04, 8, 24]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Filament spool */}
        <mesh position={[-1.1, 0.8, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.12, 24]} />
          <meshStandardMaterial color="#8fae7e" metalness={0.2} roughness={0.6} transparent opacity={0.7} />
        </mesh>
        {/* Spool core */}
        <mesh position={[-1.1, 0.8, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.14, 16]} />
          <meshStandardMaterial color="#222" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Interior ambient light */}
        <pointLight color="#ff6b35" intensity={0.6} position={[0, 0, 0]} distance={2} />

        {/* Status LED strip */}
        <mesh position={[0, -1.18, 1.0]}>
          <boxGeometry args={[1.6, 0.02, 0.02]} />
          <meshStandardMaterial color="#8fae7e" emissive="#8fae7e" emissiveIntensity={3} />
        </mesh>

        {/* Brand decal on top */}
        <mesh position={[0, 1.23, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.2]} />
          <meshStandardMaterial color="#8fae7e" transparent opacity={0.12} />
        </mesh>

        {/* Door handle */}
        <mesh position={[0.96, 0, 1.04]}>
          <boxGeometry args={[0.04, 0.4, 0.03]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Bottom feet */}
        <mesh position={[-0.8, -1.24, 0.7]}>
          <boxGeometry args={[0.2, 0.06, 0.15]} />
          <meshStandardMaterial color="#111" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0.8, -1.24, 0.7]}>
          <boxGeometry args={[0.2, 0.06, 0.15]} />
          <meshStandardMaterial color="#111" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[-0.8, -1.24, -0.7]}>
          <boxGeometry args={[0.2, 0.06, 0.15]} />
          <meshStandardMaterial color="#111" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0.8, -1.24, -0.7]}>
          <boxGeometry args={[0.2, 0.06, 0.15]} />
          <meshStandardMaterial color="#111" metalness={0.2} roughness={0.8} />
        </mesh>
      </group>
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
    // Check device memory
    if (typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory < 4) {
      setLowPower(true);
      return;
    }
    // Check WebGL support
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

        <P2SPrinter />
        <GridFloor />

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
