/**
 * Sub-Module: Staging Sandbox
 * Path: admin/features/feature-flags-staging/modules/staging-sandbox.js
 */

export class StagingSandboxModule {
  static render(container, flagsCoreInstance) {
    if (!container) return;

    const state = flagsCoreInstance?.stagingState || {
      isSandboxActive: true,
      lastSyncTime: new Date().toISOString(),
      chaosModeActive: false
    };

    const isChaosActive = state.chaosModeActive;

    container.innerHTML = `
      <div class="push-registry-panel">
        <h3 class="flags-section-title">Staging Sandbox Environment</h3>
        
        <div class="pwa-card-grid" style="margin-bottom: 1.25rem;">
          <div class="pwa-card">
            <h4>Environment Status</h4>
            <p>Sandbox Status: <strong style="color: #2da44e;">Active / Synced</strong></p>
            <p>Last Sync Timestamp: <code>${new Date(state.lastSyncTime).toLocaleString()}</code></p>
          </div>

          <div class="pwa-card">
            <h4>Chaos Engineering Status</h4>
            <p>Chaos Injector: <strong style="color: ${isChaosActive ? '#da3633' : '#8b949e'};">${isChaosActive ? 'ACTIVE (Latency Simulated)' : 'Disabled'}</strong></p>
            <p>Target Mode: <code>Network Latency & Error Injection</code></p>
          </div>
        </div>

        <div class="rollout-row" style="gap: 0.75rem;">
          <button id="btn-sync-sandbox" class="btn-primary">Sync Production Data</button>
          <button id="btn-toggle-chaos" class="${isChaosActive ? 'btn-danger' : 'tab-btn'}" style="margin-top:0.75rem;">
            ${isChaosActive ? 'Disable Chaos Injector' : 'Enable Chaos Latency Injector'}
          </button>
        </div>
      </div>
    `;

    const btnChaos = container.querySelector('#btn-toggle-chaos');
    if (btnChaos) {
      btnChaos.addEventListener('click', () => {
        state.chaosModeActive = !state.chaosModeActive;
        if (flagsCoreInstance?.addAuditLog) {
          flagsCoreInstance.addAuditLog(
            'CHAOS_MODE_TOGGLE', 
            'SYSTEM', 
            `Chaos Latency Injector ${state.chaosModeActive ? 'ENABLED' : 'DISABLED'}`
          );
        }
        this.render(container, flagsCoreInstance);
      });
    }
  }
}
