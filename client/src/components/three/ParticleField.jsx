import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField({ count = 200, bounds = 10, color = '#00d4ff' }) {
  const meshRef = useRef();
  const t = useRef(0);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * bounds;
      arr[i * 3 + 1] = (Math.random() - 0.5) * bounds;
      arr[i * 3 + 2] = (Math.random() - 0.5) * bounds;
    }
    return arr;
  }, [count, bounds]);

  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = Math.random() * 0.03 + 0.01;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    t.current += delta;
    if (!meshRef.current) return;

    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += Math.sin(t.current + i) * 0.001;
      pos.array[i * 3] += Math.cos(t.current * 0.5 + i * 0.3) * 0.0005;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
