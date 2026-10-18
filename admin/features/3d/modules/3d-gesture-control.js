/**
 * 3D Gesture Control & Mobile Touch Inspector Module
 * Path: wishes-hub/admin/features/3d/modules/3d-gesture-control.js
 */

import * as THREE from 'three';
import { coreEngine } from '../3d-core.js';

export class GestureControl {
  constructor() {
    this.moduleName = '3d-gesture-control';
    this.raycaster = new THREE.Raycaster();
    this.touchPoint = new THREE.Vector2();
    this.initialPinchDistance = null;
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    this.bindTouchEvents();
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  bindTouchEvents() {
    const domElement = coreEngine.state.activeRenderer?.domElement;
    if (!domElement) return;

    domElement.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    domElement.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
    domElement.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
  }

  handleTouchStart(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.touchPoint.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.touchPoint.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      
      this.inspectTouchedObject();
    } else if (e.touches.length === 2) {
      this.initialPinchDistance = this.getPinchDistance(e.touches[0], e.touches[1]);
    }

    coreEngine.emit('gesture:touchstart', { touchCount: e.touches.length });
  }

  handleTouchMove(e) {
    if (e.touches.length === 2 && this.initialPinchDistance !== null) {
      const currentDistance = this.getPinchDistance(e.touches[0], e.touches[1]);
      const pinchDelta = currentDistance - this.initialPinchDistance;

      coreEngine.emit('gesture:pinch', { pinchDelta });
    }
  }

  handleTouchEnd(e) {
    if (e.touches.length < 2) {
      this.initialPinchDistance = null;
    }
    coreEngine.emit('gesture:touchend', { remainingTouches: e.touches.length });
  }

  getPinchDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  inspectTouchedObject() {
    const camera = coreEngine.state.activeCamera;
    const scene = coreEngine.state.activeScene;

    if (!camera || !scene) return;

    this.raycaster.setFromCamera(this.touchPoint, camera);
    const intersects = this.raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      coreEngine.emit('gesture:object:selected', {
        objectName: hit.object.name || 'Unnamed Mesh',
        distance: hit.distance,
        point: hit.point
      });
    }
  }
}

export default GestureControl;
