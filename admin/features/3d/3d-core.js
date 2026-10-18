/**
 * 3D Engine Core State Manager & Event Bus
 * Path: wishes-hub/admin/features/3d/3d-core.js
 */

import { THREE_CONFIG } from './3d-config.js';

class ThreeDCoreEngine {
  constructor() {
    if (ThreeDCoreEngine.instance) {
      return ThreeDCoreEngine.instance;
    }

    this.state = {
      isInitialized: false,
      activeScene: null,
      activeCamera: null,
      activeRenderer: null,
      loadedAssets: new Map(),
      activeModules: new Set(),
      currentUser: null,
      currentRoom: null
    };

    this.eventListeners = new Map();
    ThreeDCoreEngine.instance = this;
  }

  // Initialize Core System
  init(configOverrides = {}) {
    if (this.state.isInitialized) return;
    this.config = { ...THREE_CONFIG, ...configOverrides };
    this.state.isInitialized = true;
    this.emit('core:ready', { timestamp: Date.now() });
    console.log('[3D Core Engine] Initialized successfully.');
  }

  // Event Bus: Subscribe
  on(eventName, callback) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName).push(callback);
  }

  // Event Bus: Emit
  emit(eventName, data) {
    if (this.eventListeners.has(eventName)) {
      this.eventListeners.get(eventName).forEach(callback => callback(data));
    }
  }

  // Register Active Module
  registerModule(moduleName, instance) {
    this.state.activeModules.add({ name: moduleName, instance });
    this.emit('module:registered', { name: moduleName });
    console.log(`[3D Core] Registered Module: ${moduleName}`);
  }

  // SHA-256 Utility for Deduplication
  async calculateSHA256(fileBuffer) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export const coreEngine = new ThreeDCoreEngine();
