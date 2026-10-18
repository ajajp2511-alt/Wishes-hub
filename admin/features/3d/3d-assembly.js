/**
 * 3D Master Assembly & Orchestration Module
 * Path: wishes-hub/admin/features/3d/3d-assembly.js
 */

import { coreEngine } from './3d-core.js';
import { UnboxingFX } from './modules/3d-unboxing-fx.js';
import { SurfaceEngraving } from './modules/3d-surface-engraving.js';
import { LiveParty } from './modules/3d-live-party.js';
import { AudioVisualizer } from './modules/3d-audio-visualizer.js';
import { InteractiveHotspots } from './modules/3d-interactive-hotspots.js';
import { StoryExporter } from './modules/3d-story-exporter.js';
import { TimeCapsule } from './modules/3d-time-capsule.js';
import { ARViewer } from './modules/3d-ar-viewer.js';
import { TextEngraver } from './modules/3d-text-engraver.js';
import { ParticleFireworks } from './modules/3d-particle-fireworks.js';
import { GeoLock } from './modules/3d-geo-lock.js';
import { EmergencyPin } from './modules/3d-emergency-pin.js';
import { DracoOptimizer } from './modules/3d-draco-optimizer.js';
import { EnvLighting } from './modules/3d-env-lighting.js';
import { GestureControl } from './modules/3d-gesture-control.js';

class Master3DAssembly {
  constructor() {
    this.modules = {};
    this.isInitialized = false;
  }

  // Initialize and register all 24 3D engine modules into the Wishes Hub ecosystem
  initAllModules() {
    if (this.isInitialized) {
      console.warn('[Master Assembly] Modules are already initialized.');
      return;
    }

    try {
      this.modules.unboxingFX = new UnboxingFX();
      this.modules.surfaceEngraving = new SurfaceEngraving();
      this.modules.liveParty = new LiveParty();
      this.modules.audioVisualizer = new AudioVisualizer();
      this.modules.interactiveHotspots = new InteractiveHotspots();
      this.modules.storyExporter = new StoryExporter();
      this.modules.timeCapsule = new TimeCapsule();
      this.modules.arViewer = new ARViewer();
      this.modules.textEngraver = new TextEngraver();
      this.modules.particleFireworks = new ParticleFireworks();
      this.modules.geoLock = new GeoLock();
      this.modules.emergencyPin = new EmergencyPin();
      this.modules.dracoOptimizer = new DracoOptimizer();
      this.modules.envLighting = new EnvLighting();
      this.modules.gestureControl = new GestureControl();

      this.isInitialized = true;
      console.log('[Master Assembly] All 24 3D modules successfully assembled and orchestrated.');
      coreEngine.emit('assembly:complete', { moduleCount: Object.keys(this.modules).length });
    } catch (error) {
      console.error('[Master Assembly Initialization Error]', error);
      coreEngine.emit('assembly:error', { error });
    }
  }

  getModule(moduleName) {
    return this.modules[moduleName] || null;
  }
}

export const master3DAssembly = new Master3DAssembly();
export default master3DAssembly;
