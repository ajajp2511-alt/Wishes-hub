/**
 * 3D Touch Unboxing & Ribbon FX Module
 * Path: wishes-hub/admin/features/3d/modules/3d-unboxing-fx.js
 */

import * as THREE from 'three';
import { coreEngine } from '../3d-core.js';

export class UnboxingFX {
  constructor() {
    this.moduleName = '3d-unboxing-fx';
    this.isUnboxed = false;
    this.boxGroup = null;
    this.ribbonMesh = null;
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Create interactive 3D gift box container over the loaded object
  createGiftBox(scene) {
    if (!scene) return;

    this.boxGroup = new THREE.Group();
    this.boxGroup.name = 'gift_box_container';

    // Box Base
    const boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xe63946,
      roughness: 0.3,
      metalness: 0.1
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.castShadow = true;
    this.boxGroup.add(boxMesh);

    // Ribbon Overlay
    const ribbonGeo = new THREE.BoxGeometry(1.22, 1.22, 0.2);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2
    });
    this.ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    this.boxGroup.add(this.ribbonMesh);

    scene.add(this.boxGroup);
    coreEngine.emit('unboxing:box:created', { boxGroup: this.boxGroup });
  }

  // Trigger touch/click unboxing animation sequence
  triggerUnboxingAnimation() {
    if (this.isUnboxed || !this.boxGroup) return;

    this.isUnboxed = true;
    coreEngine.emit('unboxing:start', { timestamp: Date.now() });

    let progress = 0;
    const animateUnbox = () => {
      progress += 0.05;

      if (this.ribbonMesh) {
        this.ribbonMesh.scale.x += 0.05;
        this.ribbonMesh.scale.y += 0.05;
        this.ribbonMesh.material.opacity = Math.max(0, 1 - progress);
        this.ribbonMesh.material.transparent = true;
      }

      if (this.boxGroup) {
        this.boxGroup.position.y += 0.05;
        this.boxGroup.scale.multiplyScalar(0.92);
      }

      if (progress < 1) {
        requestAnimationFrame(animateUnbox);
      } else {
        if (this.boxGroup && this.boxGroup.parent) {
          this.boxGroup.parent.remove(this.boxGroup);
        }
        coreEngine.emit('unboxing:complete', { timestamp: Date.now() });
      }
    };

    animateUnbox();
  }
}

export default UnboxingFX;
