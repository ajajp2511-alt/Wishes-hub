export class SyncStatusModule {
  static render(container, core) {
    const metrics = core.getSyncMetrics();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⚡ Synchronization Status & Health</h4>
        <p style="font-size:13px; color:#586069;">Real-time queue latency and bidirectional data synchronization stats.</p>

        <div style="display:flex; gap:15px; margin-top:15px;">
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:24px; font-weight:bold; color:#28a745;">${metrics.totalRowsSynced.toLocaleString()}</div>
            <small style="color:#586069;">Synced Rows</small>
          </div>
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:20px; font-weight:bold; color:#d73a49;">${metrics.failedRows}</div>
            <small style="color:#586069;">Sync Errors</small>
          </div>
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:20px; font-weight:bold;">${metrics.syncLatency}</div>
            <small style="color:#586069;">Avg Sync Latency</small>
          </div>
        </div>
      </div>
    `;
  }
}
