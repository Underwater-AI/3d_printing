import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FilamentSpool({ position = [0, 0, 0], color = '#00d4ff' }) {
  const groupRef = useRef();
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.z = t.current * 0.5;
    }
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        {/* Spool core */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.12, 24]} />
          <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Spool flanges */}
        <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.015, 8, 32]} />
          <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, -0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.015, 8, 32]} />
          <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Filament */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 0.1, 24]} />
          <meshStandardMaterial
            color={color}
            metalness={0.1}
            roughness={0.6}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </group>
  );
}
