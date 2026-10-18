/**
 * 3D Interactive Hotspots & Secret Notes Module
 * Path: wishes-hub/admin/features/3d/modules/3d-interactive-hotspots.js
 */

import * as THREE from 'three';
import { coreEngine } from '../3d-core.js';

export class InteractiveHotspots {
  constructor() {
    this.moduleName = '3d-interactive-hotspots';
    this.hotspots = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    this.bindClickEvents();
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Add interactive hotspot pin to a specific 3D coordinate
  addHotspot(position, message, label = 'Secret Note') {
    const scene = coreEngine.state.activeScene;
    if (!scene) return;

    const geo = new THREE.SphereGeometry(0.08, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff0055, wireframe: true });
    const hotspotMesh = new THREE.Mesh(geo, mat);
    
    hotspotMesh.position.set(position.x, position.y, position.z);
    hotspotMesh.userData = { isHotspot: true, label, message };

    scene.add(hotspotMesh);
    this.hotspots.push(hotspotMesh);

    coreEngine.emit('hotspot:created', { label, position });
    return hotspotMesh;
  }

  bindClickEvents() {
    window.addEventListener('pointerdown', (event) => {
      const camera = coreEngine.state.activeCamera;
      const scene = coreEngine.state.activeScene;

      if (!camera || !scene) return;

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, camera);
      const intersects = this.raycaster.intersectObjects(this.hotspots);

      if (intersects.length > 0) {
        const clickedHotspot = intersects[0].object;
        coreEngine.emit('hotspot:revealed', {
          label: clickedHotspot.userData.label,
          message: clickedHotspot.userData.message
        });
      }
    });
  }
}

export default InteractiveHotspots;
