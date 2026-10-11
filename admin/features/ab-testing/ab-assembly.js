/**
 * Main Assembly Controller - A/B Testing Studio (Optimized & Bulletproof)
 * Path: admin/features/ab-testing/ab-assembly.js
 */

import { abCoreInstance } from './ab-core.js';
import { ActiveAbTestsModule } from './modules/active-ab-tests.js';
import { LayoutVariantsModule } from './modules/layout-variants.js';
import { ConversionMetricsModule } from './modules/conversion-metrics.js';
import { AutoWinnerPromoterModule } from './modules/auto-winner-promoter.js';
import { AudienceSegmentationModule } from './modules/audience-segmentation.js';
import { HeatmapIntegratorModule } from './modules/heatmap-integrator.js';
import { MabTrafficRouterModule } from './modules/mab-traffic-router.js';
import { MultivariateEngineModule } from './modules/multivariate-engine.js';
import { VisualVariantEditorModule } from './modules/visual-variant-editor.js';
import { ExperimentRollbackHistoryModule } from './modules/experiment-rollback-history.js';
import { AiHypothesisGeneratorModule } from './modules/ai-hypothesis-generator.js';
import { RpvRevenueOptimizerModule } from './modules/rpv-revenue-optimizer.js';
import { FeatureFlagKillswitchModule } from './modules/feature-flag-killswitch.js';
import { SessionReplayIntegratorModule } from './modules/session-replay-integrator.js';
import { EdgeServerTestingModule } from './modules/edge-server-testing.js';

export class ABAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'active-tests';
    this.currentModuleInstance = null;
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) {
      console.error(`[ABAssembly] Root container #${rootId} not found.`);
      return;
    }

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="ab-testing-container" style="padding:16px; font-family: inherit;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0; font-size: 1.5rem;">A/B Testing Studio</h2>
          <small style="color:#6e7681;">Experimentation Engine, Layout Variants, MAB Traffic Optimization & Analytics</small>
        </header>

        <!-- Scrollable Navigation optimized for mobile & desktop -->
        <nav class="ab-nav-tabs" style="display:flex; gap:8px; overflow-x:auto; white-space:nowrap; margin-bottom:20px; padding-bottom:6px; -webkit-overflow-scrolling:touch;">
          <button class="tab-btn active" data-subtab="active-tests" style="flex-shrink:0;">Active Tests</button>
          <button class="tab-btn" data-subtab="layout-variants" style="flex-shrink:0;">Layout Variants</button>
          <button class="tab-btn" data-subtab="conversion-metrics" style="flex-shrink:0;">Conversion Metrics</button>
          <button class="tab-btn" data-subtab="auto-winner" style="flex-shrink:0;">Auto Winner</button>
          <button class="tab-btn" data-subtab="audience-segmentation" style="flex-shrink:0;">Segmentation</button>
          <button class="tab-btn" data-subtab="heatmap" style="flex-shrink:0;">Heatmaps</button>
          <button class="tab-btn" data-subtab="mab-router" style="flex-shrink:0;">MAB Router</button>
          <button class="tab-btn" data-subtab="multivariate" style="flex-shrink:0;">Multivariate</button>
          <button class="tab-btn" data-subtab="visual-editor" style="flex-shrink:0;">Visual Editor</button>
          <button class="tab-btn" data-subtab="rollback-history" style="flex-shrink:0;">Rollback History</button>
          <button class="tab-btn" data-subtab="ai-hypothesis" style="flex-shrink:0;">AI Ideas</button>
          <button class="tab-btn" data-subtab="rpv-optimizer" style="flex-shrink:0;">RPV Optimizer</button>
          <button class="tab-btn" data-subtab="killswitch" style="flex-shrink:0;">Kill Switch</button>
          <button class="tab-btn" data-subtab="session-replay" style="flex-shrink:0;">Session Replay</button>
          <button class="tab-btn" data-subtab="edge-testing" style="flex-shrink:0;">Edge Testing</button>
        </nav>

        <main id="ab-main-view" style="min-height: 300px;"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  destroyCurrentModule() {
    // Optional cleanup hook if sub-modules implement a destroy/unmount method
    if (this.currentModuleInstance && typeof this.currentModuleInstance.destroy === 'function') {
      try {
        this.currentModuleInstance.destroy();
      } catch (err) {
        console.error('[ABAssembly] Error during module cleanup:', err);
      }
    }
    this.currentModuleInstance = null;
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#ab-main-view');
    if (!view) return;

    // Cleanup previous sub-module state/listeners
    this.destroyCurrentModule();
    view.innerHTML = ''; // Clear container safely

    try {
      switch (this.activeSubTab) {
        case 'active-tests': 
          ActiveAbTestsModule.render(view, abCoreInstance); 
          this.currentModuleInstance = ActiveAbTestsModule;
          break;
        case 'layout-variants': 
          LayoutVariantsModule.render(view); 
          this.currentModuleInstance = LayoutVariantsModule;
          break;
        case 'conversion-metrics': 
          ConversionMetricsModule.render(view, abCoreInstance); 
          this.currentModuleInstance = ConversionMetricsModule;
          break;
        case 'auto-winner': 
          AutoWinnerPromoterModule.render(view); 
          this.currentModuleInstance = AutoWinnerPromoterModule;
          break;
        case 'audience-segmentation': 
          AudienceSegmentationModule.render(view); 
          this.currentModuleInstance = AudienceSegmentationModule;
          break;
        case 'heatmap': 
          HeatmapIntegratorModule.render(view); 
          this.currentModuleInstance = HeatmapIntegratorModule;
          break;
        case 'mab-router': 
          MabTrafficRouterModule.render(view); 
          this.currentModuleInstance = MabTrafficRouterModule;
          break;
        case 'multivariate': 
          MultivariateEngineModule.render(view); 
          this.currentModuleInstance = MultivariateEngineModule;
          break;
        case 'visual-editor': 
          VisualVariantEditorModule.render(view); 
          this.currentModuleInstance = VisualVariantEditorModule;
          break;
        case 'rollback-history': 
          ExperimentRollbackHistoryModule.render(view); 
          this.currentModuleInstance = ExperimentRollbackHistoryModule;
          break;
        case 'ai-hypothesis': 
          AiHypothesisGeneratorModule.render(view); 
          this.currentModuleInstance = AiHypothesisGeneratorModule;
          break;
        case 'rpv-optimizer': 
          RpvRevenueOptimizerModule.render(view); 
          this.currentModuleInstance = RpvRevenueOptimizerModule;
      break;
        case 'killswitch': 
          FeatureFlagKillswitchModule.render(view); 
          this.currentModuleInstance = FeatureFlagKillswitchModule;
          break;
        case 'session-replay': 
          SessionReplayIntegratorModule.render(view); 
          this.currentModuleInstance = SessionReplayIntegratorModule;
          break;
        case 'edge-testing': 
          EdgeServerTestingModule.render(view); 
          this.currentModuleInstance = EdgeServerTestingModule;
          break;
        default: 
          ActiveAbTestsModule.render(view, abCoreInstance); 
          this.currentModuleInstance = ActiveAbTestsModule;
          break;
      }
    } catch (error) {
      console.error(`[ABAssembly] Failed to render subtab: ${this.activeSubTab}`, error);
      view.innerHTML = `
        <div style="padding: 20px; background: #ffeef0; border: 1px solid #f85149; border-radius: 6px; color: #b31d28;">
          <h4 style="margin: 0 0 8px 0;">Module Loading Error</h4>
          <p style="margin: 0; font-size: 14px;">Failed to load the <strong>${this.activeSubTab}</strong> module. Please check console logs or try again.</p>
        </div>
      `;
    }
  }

  attachEventListeners() {
    const navContainer = this.container.querySelector('.ab-nav-tabs');
    if (!navContainer) return;

    navContainer.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        navContainer.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.style.fontWeight = 'normal';
          b.style.borderBottom = 'none';
        });
        
        e.target.classList.add('active');
        e.target.style.fontWeight = 'bold';
        
        this.activeSubTab = e.target.dataset.subtab;
        this.renderActiveSubTab();
      });
    });
  }
}

export const abAssemblyInstance = new ABAssembly();
