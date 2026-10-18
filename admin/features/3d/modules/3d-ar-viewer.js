/**
 * 3D WebXR Real-World AR Viewer Module
 * Path: wishes-hub/admin/features/3d/modules/3d-ar-viewer.js
 */

import { coreEngine } from '../3d-core.js';

export class ARViewer {
  constructor() {
    this.moduleName = '3d-ar-viewer';
    this.isARSupported = false;
    this.init();
  }

  async init() {
    coreEngine.registerModule(this.moduleName, this);
    await this.checkARSupport();
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Check WebXR AR compatibility on target mobile/desktop device
  async checkARSupport() {
    if ('xr' in navigator) {
      try {
        this.isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
      } catch (e) {
        this.isARSupported = false;
      }
    } else {
      this.isARSupported = false;
    }

    coreEngine.emit('ar:support:checked', { supported: this.isARSupported });
  }

  // Launch immersive WebXR AR session for placing 3D wishes in real world
  async startARSession() {
    if (!this.isARSupported) {
      throw new Error('[AR Viewer] WebXR Augmented Reality is not supported on this device.');
    }

    const renderer = coreEngine.state.activeRenderer;
    const scene = coreEngine.state.activeScene;

    if (!renderer || !scene) {
      throw new Error('[AR Viewer] Active Three.js renderer not found.');
    }

    try {
      renderer.xr.enabled = true;
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.body }
      });

      await renderer.xr.setSession(session);
      coreEngine.emit('ar:session:started', { session });

      session.addEventListener('end', () => {
        renderer.xr.enabled = false;
        coreEngine.emit('ar:session:ended', {});
      });
    } catch (error) {
      console.error('[AR Session Error]', error);
      coreEngine.emit('ar:session:error', { error });
      throw error;
    }
  }
}

export default ARViewer;
