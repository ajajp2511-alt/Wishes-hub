/**
 * 3D Text & Typography Extrusion Module
 * Path: wishes-hub/admin/features/3d/modules/3d-text-engraver.js
 */

import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { coreEngine } from '../3d-core.js';

export class TextEngraver {
  constructor() {
    this.moduleName = '3d-text-engraver';
    this.fontLoader = new FontLoader();
    this.defaultFontUrl = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json';
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Generate 3D extruded mesh text for wishes
  async create3DText(textString, options = {}) {
    if (!textString) {
      throw new Error('[Text Engraver] Text string is required.');
    }

    return new Promise((resolve, reject) => {
      this.fontLoader.load(
        options.fontUrl || this.defaultFontUrl,
        (font) => {
          const textGeo = new TextGeometry(textString, {
            font: font,
            size: options.size || 0.3,
            depth: options.depth || 0.05,
            curveSegments: options.curveSegments || 12,
            bevelEnabled: options.bevelEnabled ?? true,
            bevelThickness: options.bevelThickness || 0.02,
            bevelSize: options.bevelSize || 0.01,
            bevelOffset: options.bevelOffset || 0,
            bevelSegments: options.bevelSegments || 3
          });

          textGeo.computeBoundingBox();
          textGeo.center(); // Center geometry origin

          const textMat = new THREE.MeshStandardMaterial({
            color: options.color || 0xffd700,
            metalness: options.metalness || 0.8,
            roughness: options.roughness || 0.2
          });

          const textMesh = new THREE.Mesh(textGeo, textMat);
          textMesh.castShadow = true;
          textMesh.receiveShadow = true;

          const scene = coreEngine.state.activeScene;
          if (scene && options.addToScene !== false) {
            scene.add(textMesh);
          }

          coreEngine.emit('text:engraved', { textString, mesh: textMesh });
          resolve(textMesh);
        },
        undefined,
        (error) => {
          console.error('[Text Engraver Error]', error);
          reject(error);
        }
      );
    });
  }
}

export default TextEngraver;
