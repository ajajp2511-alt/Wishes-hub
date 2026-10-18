/**
 * 3D Surface Engraving & Texture Customization Module
 * Path: wishes-hub/admin/features/3d/modules/3d-surface-engraving.js
 */

import * as THREE from 'three';
import { coreEngine } from '../3d-core.js';

export class SurfaceEngraving {
  constructor() {
    this.moduleName = '3d-surface-engraving';
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Generate dynamic canvas texture with custom engraved text/logo
  createEngravedTexture(text, options = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = options.width || 1024;
    canvas.height = options.height || 1024;

    const ctx = canvas.getContext('2d');

    // Base background texture fill
    ctx.fillStyle = options.bgColor || '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Engraved Text Formatting
    const fontSize = options.fontSize || 60;
    const fontFamily = options.fontFamily || 'Arial, sans-serif';
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Engraved Metallic/Gold Inlay Effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 4;

    ctx.fillStyle = options.textColor || '#ffd700'; // Default Metallic Gold
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  // Apply engraved texture directly onto a target 3D Mesh
  applyEngravingToMesh(mesh, text, options = {}) {
    if (!mesh || !mesh.isMesh) {
      console.warn('[Surface Engraving] Invalid target mesh.');
      return;
    }

    const engravedTexture = this.createEngravedTexture(text, options);

    if (Array.isArray(mesh.material)) {
      mesh.material[0].map = engravedTexture;
      mesh.material[0].needsUpdate = true;
    } else if (mesh.material) {
      mesh.material.map = engravedTexture;
      mesh.material.needsUpdate = true;
    }

    coreEngine.emit('engraving:applied', { meshName: mesh.name, text });
  }
}

export default SurfaceEngraving;
