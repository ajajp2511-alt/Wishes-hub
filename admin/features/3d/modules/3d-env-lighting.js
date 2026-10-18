/**
 * 3D Environmental Lighting & HDR Skybox Module
 * Path: wishes-hub/admin/features/3d/modules/3d-env-lighting.js
 */

import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { coreEngine } from '../3d-core.js';

export class EnvLighting {
  constructor() {
    this.moduleName = '3d-env-lighting';
    this.rgbeLoader = new RGBELoader();
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Load HDR environment map for realistic reflections and PBR lighting
  async loadHDRIEnvironment(hdrUrl, options = {}) {
    const scene = coreEngine.state.activeScene;
    const renderer = coreEngine.state.activeRenderer;

    if (!scene || !renderer) {
      throw new Error('[Env Lighting] Active Three.js scene and renderer are required.');
    }

    return new Promise((resolve, reject) => {
      this.rgbeLoader.load(
        hdrUrl,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;

          if (options.useAsBackground !== false) {
            scene.background = texture;
          }
          scene.environment = texture;

          coreEngine.emit('env:hdr:loaded', { hdrUrl });
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error('[HDR Loader Error]', error);
          coreEngine.emit('env:hdr:error', { error: error.message });
          reject(error);
        }
      );
    });
  }

  // Set preset studio lighting configurations
  setStudioLighting(preset = 'warm') {
    const scene = coreEngine.state.activeScene;
    if (!scene) return;

    // Remove existing directional lights if needed
    scene.children.forEach((child) => {
      if (child.isDirectionalLight || child.isPointLight) {
        scene.remove(child);
      }
    });

    const mainLight = new THREE.DirectionalLight(preset === 'warm' ? 0xfffaed : 0xe0f7ff, 1.5);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
    fillLight.position.set(-5, 5, -5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    scene.add(mainLight, fillLight, ambientLight);
    coreEngine.emit('env:lighting:preset', { preset });
  }
}

export default EnvLighting;
