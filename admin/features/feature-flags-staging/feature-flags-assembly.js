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
      <div class="flags-manager-container" style="padding: 16px;">
        <header class="flags-header" style="display:flex; justify-space-between; align-items:center; margin-bottom: 20px;">
          <div>
            <h2 style="margin:0;">Feature Flags & Staging</h2>
            <small style="color: #6e7681;">Modular Control Center</small>
          </div>
          <span class="badge" style="background:#2da44e; color:#fff; padding:4px 8px; border-radius:12px; font-size:12px;">Staging Active</span>
        </header>

        <nav class="flags-tabs" style="display:flex; gap:10px; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="feature-toggles">Feature Toggles</button>
          <button class="tab-btn" data-subtab="staging-sandbox">Staging Sandbox</button>
          <button class="tab-btn" data-subtab="rollback-reset">Data Rollback & Reset</button>
          <button class="tab-btn" data-subtab="audit-logs">Audit Logs</button>
        </nav>

        <main id="flags-main-view" class="flags-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#flags-main-view');

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
    }
  }

  attachEventListeners() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => b.style.fontWeight = 'normal');
        e.target.style.fontWeight = 'bold';
        this.activeSubTab = e.target.dataset.subtab;
        this.renderActiveSubTab();
      });
    });

    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('chk-flag')) {
        featureFlagsCoreInstance.toggleFlag(e.target.dataset.id, e.target.checked);
        this.renderActiveSubTab();
      }

      if (e.target.classList.contains('rng-rollout')) {
        const flagId = e.target.dataset.id;
        const val = e.target.value;
        featureFlagsCoreInstance.updateRolloutPercentage(flagId, val);
        const lbl = this.container.querySelector(`#lbl-${flagId}`);
        if (lbl) lbl.textContent = `${val}% Users`;
      }
    });

    this.container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn-kill-test')) {
        const res = featureFlagsCoreInstance.triggerKillSwitch(e.target.dataset.id, 8.5);
        if (res.triggered) {
          alert(res.message);
          this.renderActiveSubTab();
        }
      }

      if (e.target.id === 'btn-sync-sandbox') {
        featureFlagsCoreInstance.addAuditLog('SANDBOX_SYNC', 'SANDBOX', 'Data synced with production');
        alert('Staging Sandbox Synced Successfully!');
      }

      if (e.target.id === 'btn-execute-rollback') {
        const snapshot = this.container.querySelector('#snapshot-select')?.value;
        if (confirm(`Confirm data rollback to ${snapshot}?`)) {
          const res = await featureFlagsCoreInstance.executeDataRollback(snapshot);
          alert(res.message);
          this.renderActiveSubTab();
        }
      }
    });
  }
}

export const featureFlagsAssemblyInstance = new FeatureFlagsAssembly();
