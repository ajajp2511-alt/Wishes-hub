/**
 * 3D Wish Viewer & Asset Engine - Assembly File
 * Path: wishes-hub/admin/features/3d/3d-assembly.js
 */

import { THREE_CONFIG } from './3d-config.js';
import { coreEngine } from './3d-core.js';

// Import All Standalone Feature Modules
import { AssetTelegramSync } from './modules/3d-asset-telegram-sync.js';
import { AdminAssetUpload } from './modules/3d-admin-asset-upload.js';
import { AIGenerator } from './modules/3d-ai-generator.js';
import { AdminPricing } from './modules/3d-admin-pricing.js';
import { WishViewerEngine } from './modules/3d-wish-viewer-engine.js';
import { UnboxingFX } from './modules/3d-unboxing-fx.js';
import { SurfaceEngraving } from './modules/3d-surface-engraving.js';
import { LiveParty } from './modules/3d-live-party.js';
import { AudioVisualizer } from './modules/3d-audio-visualizer.js';
import { InteractiveHotspots } from './modules/3d-interactive-hotspots.js';
import { StoryExporter } from './modules/3d-story-exporter.js';
import { TimeCapsule } from './modules/3d-time-capsule.js';
import { ARViewer } from './modules/3d-ar-viewer.js';
import { TextEngraver } from './modules/3d-text-engraver.js';
import { GamifiedReward } from './modules/3d-gamified-reward.js';
import { AIAvatar } from './modules/3d-ai-avatar.js';
import { GroupChain } from './modules/3d-group-chain.js';
import { WeatherFX } from './modules/3d-weather-fx.js';
import { GeoLock } from './modules/3d-geo-lock.js';
import { ScratchCard } from './modules/3d-scratch-card.js';
import { ReverseWish } from './modules/3d-reverse-wish.js';
import { FaceFilter } from './modules/3d-face-filter.js';
import { AIEmotions } from './modules/3d-ai-emotions.js';
import { RiddleVault } from './modules/3d-riddle-vault.js';

export class ThreeDWishAssembly {
  constructor(containerElement, userOptions = {}) {
    this.container = containerElement;
    this.options = userOptions;
    this.modules = {};
    
    this.bootstrap();
  }

  bootstrap() {
    // Initialize Core Engine
    coreEngine.init(this.options);

    // Instantiate & Register All Feature Modules
    this.modules.telegramSync = new AssetTelegramSync();
    this.modules.adminUpload = new AdminAssetUpload();
    this.modules.aiGenerator = new AIGenerator();
    this.modules.adminPricing = new AdminPricing();
    this.modules.viewerEngine = new WishViewerEngine(this.container);
    this.modules.unboxingFX = new UnboxingFX();
    this.modules.surfaceEngraving = new SurfaceEngraving();
    this.modules.liveParty = new LiveParty();
    this.modules.audioVisualizer = new AudioVisualizer();
    this.modules.interactiveHotspots = new InteractiveHotspots();
    this.modules.storyExporter = new StoryExporter();
    this.modules.timeCapsule = new TimeCapsule();
    this.modules.arViewer = new ARViewer();
    this.modules.textEngraver = new TextEngraver();
    this.modules.gamifiedReward = new GamifiedReward();
    this.modules.aiAvatar = new AIAvatar();
    this.modules.groupChain = new GroupChain();
    this.modules.weatherFX = new WeatherFX();
    this.modules.geoLock = new GeoLock();
    this.modules.scratchCard = new ScratchCard();
    this.modules.reverseWish = new ReverseWish();
    this.modules.faceFilter = new FaceFilter();
    this.modules.aiEmotions = new AIEmotions();
    this.modules.riddleVault = new RiddleVault();

    console.log('[3D Wish Assembly] All 24 Modules Successfully Assembled.');
  }
}

export default ThreeDWishAssembly;
