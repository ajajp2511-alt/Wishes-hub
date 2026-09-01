/**
 * Modular Assembly Controller
 * Path: admin/features/feature-flags-staging/feature-flags-assembly.js
 */

import { featureFlagsCoreInstance } from './feature-flags-core.js';
import { FeatureTogglesModule } from './modules/feature-toggles.js';
import { StagingSandboxModule } from './modules/staging-sandbox.js';
import { RollbackResetModule } from './modules/rollback-reset.js';
import { AuditLogsModule } from './modules/audit-logs.js';

export class FeatureFlagsAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'feature-toggles';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="feature-flags-container">
        <header class="flags-header">
          <div class="flags-title-group">
            <h2>Feature Flags & Staging</h2>
            <span class="subtitle">Modular Control Center</span>
          </div>
          <span class="badge-staging-active">Staging Active</span>
        </header>

        <nav class="flags-tabs">
          <button class="tab-btn ${this.activeSubTab === 'feature-toggles' ? 'active' : ''}" data-subtab="feature-toggles">Feature Toggles</button>
          <button class="tab-btn ${this.activeSubTab === 'staging-sandbox' ? 'active' : ''}" data-subtab="staging-sandbox">Staging Sandbox</button>
          <button class="tab-btn ${this.activeSubTab === 'rollback-reset' ? 'active' : ''}" data-subtab="rollback-reset">Data Rollback & Reset</button>
          <button class="tab-btn ${this.activeSubTab === 'audit-logs' ? 'active' : ''}" data-subtab="audit-logs">Audit Logs</button>
        </nav>

        <main id="flags-main-view" class="flags-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#flags-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'feature-toggles':
        FeatureTogglesModule.render(view, featureFlagsCoreInstance);
        break;
      case 'staging-sandbox':
        StagingSandboxModule.render(view, featureFlagsCoreInstance);
        break;
      case 'rollback-reset':
        RollbackResetModule.render(view);
        break;
      case 'audit-logs':
        AuditLogsModule.render(view, featureFlagsCoreInstance);
        break;
      default:
        FeatureTogglesModule.render(view, featureFlagsCoreInstance);
    }
  }

  attachEventListeners() {
    // Single Event Delegation Listener for Container
    this.container.addEventListener('click', async (e) => {
      // Tab Switching Logic
      const tabBtn = e.target.closest('.tab-btn');
      if (tabBtn) {
        this.container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabBtn.classList.add('active');
        this.activeSubTab = tabBtn.dataset.subtab;
        this.renderActiveSubTab();
        return;
      }

      // Circuit Breaker / Kill Test Action
      if (e.target.classList.contains('btn-kill-test')) {
        const flagId = e.target.dataset.id;
        const res = featureFlagsCoreInstance.triggerKillSwitch(flagId, 8.5);
        if (res.triggered) {
          alert(res.message);
          this.renderActiveSubTab();
        }
        return;
      }

      // Sync Sandbox Action
      if (e.target.id === 'btn-sync-sandbox') {
        featureFlagsCoreInstance.addAuditLog('SANDBOX_SYNC', 'SANDBOX', 'Data synced with production');
        alert('Staging Sandbox Synced Successfully!');
        return;
      }

      // Data Rollback Action
      if (e.target.id === 'btn-execute-rollback') {
        const snapshotSelect = this.container.querySelector('#snapshot-select');
        const snapshot = snapshotSelect ? snapshotSelect.value : 'Latest';
        if (confirm(`Confirm data rollback to ${snapshot}?`)) {
          const res = await featureFlagsCoreInstance.executeDataRollback(snapshot);
          alert(res.message);
          this.renderActiveSubTab();
        }
      }
    });

    // Checkbox Toggles
    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('chk-flag')) {
        featureFlagsCoreInstance.toggleFlag(e.target.dataset.id, e.target.checked);
        this.renderActiveSubTab();
      }
    });

    // Realtime Rollout Range Slider
    const handleSliderChange = (e) => {
      if (e.target.classList.contains('rng-rollout')) {
        const flagId = e.target.dataset.id;
        const val = e.target.value;
        featureFlagsCoreInstance.updateRolloutPercentage(flagId, val);
        const lbl = this.container.querySelector(`#lbl-${flagId}`);
        if (lbl) lbl.textContent = `${val}% Users`;
      }
    };

    this.container.addEventListener('input', handleSliderChange);
    this.container.addEventListener('change', handleSliderChange);
  }
}

export const featureFlagsAssemblyInstance = new FeatureFlagsAssembly();
