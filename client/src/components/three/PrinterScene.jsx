import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function P2SPrinter() {
  const groupRef = useRef();
  const headRef = useRef();
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t.current * 0.3) * 0.035;
    }
    if (headRef.current) {
      headRef.current.position.x = Math.sin(t.current * 1.2) * 0.8;
    }
  });

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#88aacc',
    transmission: 0.85,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.35,
  }), []);

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Main chassis */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.96, 2.39, 2.03]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Top panel */}
        <mesh position={[0, 1.21, 0]}>
          <boxGeometry args={[1.98, 0.04, 2.05]} />
          <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Front glass */}
        <mesh position={[0, 0, 1.02]}>
          <boxGeometry args={[1.9, 2.3, 0.04]} />
          <primitive object={glassMaterial} attach="material" />
        </mesh>

        {/* Build plate */}
        <mesh position={[0, -0.7, 0]} receiveShadow>
          <boxGeometry args={[1.28, 0.05, 1.28]} />
          <meshStandardMaterial color="#3a2a1a" metalness={0.3} roughness={0.7} />
        </mesh>

        {/* PEI texture on build plate */}
        <mesh position={[0, -0.67, 0]} receiveShadow>
          <boxGeometry args={[1.26, 0.01, 1.26]} />
          <meshStandardMaterial color="#5a4a3a" metalness={0.2} roughness={0.9} />
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
          {/* Nozzle glow */}
          <pointLight color="#ff6b35" intensity={2} distance={0.6} position={[0, -0.15, 0]} />
          {/* Hotend indicator */}
          <mesh position={[0, -0.05, 0.08]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={2} />
          </mesh>
        </group>

        {/* Spool holder */}
        <mesh position={[-1.1, 0.8, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.05, 8, 24]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Filament spool */}
        <mesh position={[-1.1, 0.8, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.15, 24]} />
          <meshStandardMaterial color="#00d4ff" metalness={0.2} roughness={0.6} transparent opacity={0.7} />
        </mesh>

        {/* Interior ambient light */}
        <pointLight color="#ff6b35" intensity={0.6} position={[0, 0, 0]} distance={2} />

        {/* Status LED strip */}
        <mesh position={[0, -1.18, 1.0]}>
          <boxGeometry args={[1.6, 0.02, 0.02]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
        </mesh>

        {/* Brand decal placeholder */}
        <mesh position={[0, 1.22, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.2]} />
          <meshStandardMaterial color="#00d4ff" transparent opacity={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

function GridFloor() {
  return (
    <gridHelper
      args={[20, 40, '#00d4ff', '#001a33']}
      position={[0, -1.5, 0]}
      material-transparent
      material-opacity={0.15}
    />
  );
}

export default function PrinterScene() {
  // Low-power fallback
  if (typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory < 4) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)',
        borderRadius: '12px',
      }}>
        <img
          src="/assets/printer/p2s-front.webp"
          alt="Bambu Lab P2S — the printer used by Underwater AI"
          style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [3, 2, 4], fov: 45 }}
      shadows
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Stars radius={80} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />

        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow shadow-mapSize={1024} />
        <pointLight position={[2, 3, 2]} color="#00d4ff" intensity={1.5} />
        <pointLight position={[-3, 1, -2]} color="#0066ff" intensity={0.5} />

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
