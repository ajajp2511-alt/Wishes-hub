/**
 * Sub-Module: Staging Sandbox
 * Path: admin/features/feature-flags-staging/modules/staging-sandbox.js
 */

export class StagingSandboxModule {
  static render(container, flagsCoreInstance) {
    const state = flagsCoreInstance.stagingState;
    container.innerHTML = `
      <div class="sandbox-panel" style="border:1px solid #e1e4e8; padding:20px; border-radius:8px; background:#fff;">
        <h4>Staging Sandbox Environment</h4>
        <p>Sandbox Status: <strong style="color:#2da44e;">Active / Synced</strong></p>
        <p>Last Sync Timestamp: <code>${new Date(state.lastSyncTime).toLocaleString()}</code></p>
        <div style="margin-top:20px; display:flex; gap:10px;">
          <button id="btn-sync-sandbox" style="padding:8px 16px; background:#0366d6; color:#fff; border:none; border-radius:6px; cursor:pointer;">Sync Production Data</button>
          <button id="btn-toggle-chaos" style="padding:8px 16px; background:#f6f8fa; border:1px solid #d1d5da; border-radius:6px; cursor:pointer;">Toggle Chaos Latency Injector</button>
        </div>
      </div>
    `;
  }
}
