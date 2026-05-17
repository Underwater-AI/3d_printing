import * as THREE from 'three';

/**
 * Create a procedural Bambu Lab P2S printer geometry.
 * Returns a THREE.Group ready to add to a scene.
 */
export function createPrinterGeometry() {
  const group = new THREE.Group();

  // Main chassis — 392×478×406 mm scaled to ~2 unit max dimension
  const bodyGeo = new THREE.BoxGeometry(1.96, 2.39, 2.03);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.6,
    roughness: 0.4,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Front glass panel — slightly inset
  const glassGeo = new THREE.BoxGeometry(1.9, 2.3, 0.04);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x88aacc,
    transmission: 0.85,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.35,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, 0, 1.02);
  group.add(glass);

  // Build plate — PEI textured
  const plateGeo = new THREE.BoxGeometry(1.28, 0.05, 1.28);
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x3a2a1a,
    metalness: 0.3,
    roughness: 0.7,
  });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.set(0, -0.7, 0);
  plate.receiveShadow = true;
  group.add(plate);

  // Toolhead rail — horizontal cylinder
  const railGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.0, 8);
  const railMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.9,
    roughness: 0.1,
  });
  const rail = new THREE.Mesh(railGeo, railMat);
  rail.rotation.z = Math.PI / 2;
  rail.position.set(0, 0.5, 0);
  group.add(rail);

  // Toolhead
  const headGroup = new THREE.Group();
  const headGeo = new THREE.BoxGeometry(0.12, 0.18, 0.12);
  const headMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.8,
    roughness: 0.2,
  });
  const head = new THREE.Mesh(headGeo, headMat);
  headGroup.add(head);

  // Nozzle glow
  const nozzleLight = new THREE.PointLight(0xff6b35, 2, 0.5);
  nozzleLight.position.set(0, -0.1, 0);
  headGroup.add(nozzleLight);

  headGroup.position.set(0, 0.5, 0);
  headGroup.name = 'toolhead';
  group.add(headGroup);

  // Interior ambient glow
  const interiorLight = new THREE.PointLight(0xff6b35, 0.8, 2);
  interiorLight.position.set(0, 0, 0);
  group.add(interiorLight);

  return group;
}

/**
 * Create a particle field simulating filament particles.
 */
export function createParticleField(count = 500, bounds = { x: 2, y: 3, z: 2 }) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * bounds.x;
    positions[i3 + 1] = Math.random() * bounds.y;
    positions[i3 + 2] = (Math.random() - 0.5) * bounds.z;
    velocities[i3] = (Math.random() - 0.5) * 0.002;
    velocities[i3 + 1] = -Math.random() * 0.01 - 0.005;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.015,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  points.name = 'particles';
  points.userData = { velocities, bounds };
  return points;
}
