/**
 * 3D Particle Fireworks & Celebration FX Module
 * Path: wishes-hub/admin/features/3d/modules/3d-particle-fireworks.js
 */

import * as THREE from 'three';
import { coreEngine } from '../3d-core.js';

export class ParticleFireworks {
  constructor() {
    this.moduleName = '3d-particle-fireworks';
    this.fireworksSystems = [];
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Trigger bursting particle firework explosion in 3D scene
  launchFirework(position = { x: 0, y: 2, z: 0 }, particleCount = 500) {
    const scene = coreEngine.state.activeScene;
    if (!scene) return;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color();
    baseColor.setHSL(Math.random(), 1.0, 0.6);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Start at explosion origin
      positions[i3] = position.x;
      positions[i3 + 1] = position.y;
      positions[i3 + 2] = position.z;

      // Random spherical velocity vector
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const speed = Math.random() * 0.08 + 0.02;

      velocities[i3] = speed * Math.sin(phi) * Math.cos(theta);
      velocities[i3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      velocities[i3 + 2] = speed * Math.cos(phi);

      colors[i3] = baseColor.r;
      colors[i3 + 1] = baseColor.g;
      colors[i3 + 2] = baseColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    const fireworkObj = {
      system: particleSystem,
      velocities,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.01
    };

    this.fireworksSystems.push(fireworkObj);
    this.animateFireworks();

    coreEngine.emit('fireworks:launched', { position, particleCount });
  }

  animateFireworks() {
    if (this.fireworksSystems.length === 0) return;

    const animate = () => {
      let activeExists = false;

      this.fireworksSystems.forEach((fw) => {
        if (fw.life <= 0) return;
        activeExists = true;

        fw.life -= fw.decay;
        const positions = fw.system.geometry.attributes.position.array;
        const count = positions.length / 3;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          positions[i3] += fw.velocities[i3];
          positions[i3 + 1] += fw.velocities[i3 + 1] - 0.002; // Gravity pull
          positions[i3 + 2] += fw.velocities[i3 + 2];
        }

        fw.system.geometry.attributes.position.needsUpdate = true;
        fw.system.material.opacity = Math.max(0, fw.life);

        if (fw.life <= 0) {
          coreEngine.state.activeScene?.remove(fw.system);
          fw.system.geometry.dispose();
          fw.system.material.dispose();
        }
      });

      if (activeExists) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
}

export default ParticleFireworks;
