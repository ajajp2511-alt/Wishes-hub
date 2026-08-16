/**
 * Main Assembly Controller - A/B Testing Studio
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
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="ab-testing-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">A/B Testing Studio</h2>
          <small style="color:#6e7681;">Experimentation Engine, Layout Variants, MAB Traffic Optimization & Analytics</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="active-tests">Active Tests</button>
          <button class="tab-btn" data-subtab="layout-variants">Layout Variants</button>
          <button class="tab-btn" data-subtab="conversion-metrics">Conversion Metrics</button>
          <button class="tab-btn" data-subtab="auto-winner">Auto Winner</button>
          <button class="tab-btn" data-subtab="audience-segmentation">Segmentation</button>
          <button class="tab-btn" data-subtab="heatmap">Heatmaps</button>
          <button class="tab-btn" data-subtab="mab-router">MAB Router</button>
          <button class="tab-btn" data-subtab="multivariate">Multivariate</button>
          <button class="tab-btn" data-subtab="visual-editor">Visual Editor</button>
          <button class="tab-btn" data-subtab="rollback-history">Rollback History</button>
          <button class="tab-btn" data-subtab="ai-hypothesis">AI Ideas</button>
          <button class="tab-btn" data-subtab="rpv-optimizer">RPV Optimizer</button>
          <button class="tab-btn" data-subtab="killswitch">Kill Switch</button>
          <button class="tab-btn" data-subtab="session-replay">Session Replay</button>
          <button class="tab-btn" data-subtab="edge-testing">Edge Testing</button>
        </nav>

        <main id="ab-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#ab-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'active-tests': ActiveAbTestsModule.render(view, abCoreInstance); break;
      case 'layout-variants': LayoutVariantsModule.render(view); break;
      case 'conversion-metrics': ConversionMetricsModule.render(view, abCoreInstance); break;
      case 'auto-winner': AutoWinnerPromoterModule.render(view); break;
      case 'audience-segmentation': AudienceSegmentationModule.render(view); break;
      case 'heatmap': HeatmapIntegratorModule.render(view); break;
      case 'mab-router': MabTrafficRouterModule.render(view); break;
      case 'multivariate': MultivariateEngineModule.render(view); break;
      case 'visual-editor': VisualVariantEditorModule.render(view); break;
      case 'rollback-history': ExperimentRollbackHistoryModule.render(view); break;
      case 'ai-hypothesis': AiHypothesisGeneratorModule.render(view); break;
      case 'rpv-optimizer': RpvRevenueOptimizerModule.render(view); break;
      case 'killswitch': FeatureFlagKillswitchModule.render(view); break;
      case 'session-replay': SessionReplayIntegratorModule.render(view); break;
      case 'edge-testing': EdgeServerTestingModule.render(view); break;
      default: ActiveAbTestsModule.render(view, abCoreInstance); break;
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
  }
}

export const abAssemblyInstance = new ABAssembly();
