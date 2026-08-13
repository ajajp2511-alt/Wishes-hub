/**
 * Main Assembly Controller - Content Engine & Templates
 * Path: admin/features/content-templates/content-assembly.js
 */

import { contentCoreInstance } from './content-core.js';
import { CanvasBuilderModule } from './modules/canvas-builder.js';
import { FontCanvasAssetsModule } from './modules/font-canvas-assets.js';
import { FestiveAssetPacksModule } from './modules/festive-asset-packs.js';
import { AiDesignStudioModule } from './modules/ai-design-studio.js';
import { MotionAudioEngineModule } from './modules/motion-audio-engine.js';
import { BulkTemplateRenderModule } from './modules/bulk-template-render.js';
import { ExportOptimizationModule } from './modules/export-optimization.js';

export class ContentAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'canvas-builder';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="content-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Content Engine & Templates Studio</h2>
          <small style="color:#6e7681;">Canvas Builder, Assets, AI Tools, Motion & Export Engine</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="canvas-builder">Canvas Builder</button>
          <button class="tab-btn" data-subtab="font-canvas-assets">Font & Assets</button>
          <button class="tab-btn" data-subtab="festive-asset-packs">Festive Asset Packs</button>
          <button class="tab-btn" data-subtab="ai-design-studio">AI Design Studio</button>
          <button class="tab-btn" data-subtab="motion-audio-engine">Motion & Audio</button>
          <button class="tab-btn" data-subtab="bulk-template-render">Batch Render & QR</button>
          <button class="tab-btn" data-subtab="export-optimization">Export & Watermark</button>
        </nav>

        <main id="content-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#content-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'canvas-builder': CanvasBuilderModule.render(view, contentCoreInstance); break;
      case 'font-canvas-assets': FontCanvasAssetsModule.render(view); break;
      case 'festive-asset-packs': FestiveAssetPacksModule.render(view, contentCoreInstance); break;
      case 'ai-design-studio': AiDesignStudioModule.render(view); break;
      case 'motion-audio-engine': MotionAudioEngineModule.render(view); break;
      case 'bulk-template-render': BulkTemplateRenderModule.render(view); break;
      case 'export-optimization': ExportOptimizationModule.render(view); break;
      default: CanvasBuilderModule.render(view, contentCoreInstance); break;
    }
  }

  attachEventListeners() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.style.fontWeight = 'normal';
        });
        
        e.target.classList.add('active');
        e.target.style.fontWeight = 'bold';
        
        this.activeSubTab = e.target.dataset.subtab;
        this.renderActiveSubTab();
      });
    });

    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-ratio')) {
        const ratio = e.target.dataset.ratio;
        contentCoreInstance.setCanvasRatio(ratio);
        this.renderActiveSubTab();
      }
    });
  }
}

export const contentAssemblyInstance = new ContentAssembly();
