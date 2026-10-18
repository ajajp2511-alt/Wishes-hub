/**
 * 3D Asset Compression & Draco Optimization Module
 * Path: wishes-hub/admin/features/3d/modules/3d-draco-optimizer.js
 */

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { coreEngine } from '../3d-core.js';

export class DracoOptimizer {
  constructor() {
    this.moduleName = '3d-draco-optimizer';
    this.dracoLoader = new DRACOLoader();
    this.initLoader();
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  initLoader() {
    // Configure Draco decoder path for compressed 3D meshes
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    this.dracoLoader.setDecoderConfig({ type: 'js' });
  }

  // Load compressed 3D GLTF / GLB model using Draco mesh decompression
  async loadCompressedModel(url) {
    if (!url) {
      throw new Error('[Draco Optimizer] Model URL is required.');
    }

    const loader = new GLTFLoader();
    loader.setDRACOLoader(this.dracoLoader);

    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          coreEngine.emit('draco:model:loaded', { url, model: gltf.scene });
          resolve(gltf.scene);
        },
        (xhr) => {
          if (xhr.total > 0) {
            const progress = (xhr.loaded / xhr.total) * 100;
            coreEngine.emit('draco:model:progress', { progress });
          }
        },
        (error) => {
          console.error('[Draco Loader Error]', error);
          coreEngine.emit('draco:model:error', { error: error.message });
          reject(error);
        }
      );
    });
  }

  dispose() {
    this.dracoLoader.dispose();
  }
}

export default DracoOptimizer;
