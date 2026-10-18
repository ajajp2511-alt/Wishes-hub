/**
 * Three.js WebGL Interactive Viewer Engine Module
 * Path: wishes-hub/admin/features/3d/modules/3d-wish-viewer-engine.js
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { THREE_CONFIG } from '../3d-config.js';
import { coreEngine } from '../3d-core.js';

export class WishViewerEngine {
  constructor(container) {
    this.moduleName = '3d-wish-viewer-engine';
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.currentModel = null;

    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    if (this.container) {
      this.setupScene();
      this.addLights();
      this.animate();
    }
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  setupScene() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(THREE_CONFIG.VIEWER.DEFAULT_BG_COLOR);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      THREE_CONFIG.VIEWER.FOV,
      width / height,
      THREE_CONFIG.VIEWER.NEAR,
      THREE_CONFIG.VIEWER.FAR
    );
    this.camera.position.set(0, 1.5, 3);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, THREE_CONFIG.VIEWER.PIXEL_RATIO_LIMIT));
    this.renderer.shadowMap.enabled = THREE_CONFIG.VIEWER.SHADOWS_ENABLED;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Sync state to Core Engine
    coreEngine.state.activeScene = this.scene;
    coreEngine.state.activeCamera = this.camera;
    coreEngine.state.activeRenderer = this.renderer;

    window.addEventListener('resize', () => this.onWindowResize());
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffaa00, 0.5, 10);
    pointLight.position.set(-3, 2, -2);
    this.scene.add(pointLight);
  }

  async loadModel(url) {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          if (this.currentModel) {
            this.scene.remove(this.currentModel);
          }
          this.currentModel = gltf.scene;
          this.scene.add(this.currentModel);

          coreEngine.emit('viewer:model:loaded', { model: this.currentModel });
          resolve(this.currentModel);
        },
        (xhr) => {
          const progress = (xhr.loaded / xhr.total) * 100;
          coreEngine.emit('viewer:model:progress', { progress });
        },
        (error) => {
          console.error('[Viewer Engine Error]', error);
          reject(error);
        }
      );
    });
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.controls) this.controls.update();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

export default WishViewerEngine;
