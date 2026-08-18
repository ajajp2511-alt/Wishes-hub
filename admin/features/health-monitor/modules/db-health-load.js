export class DbHealthLoadModule {
  static render(container, core) {
    const db = core.getDbStatus();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🗄️ Database Health & Load Metrics</h4>
        <p style="font-size:13px; color:#586069;">Connection pool limits, query latencies, and storage allocation.</p>

        <div style="margin-top:15px; font-size:13px;">
          <p><strong>Database Status:</strong> <span style="color:#28a745; font-weight:bold;">${db.status}</span></p>
          <p><strong>Active Connection Pool:</strong> ${db.connectionsActive} / ${db.connectionsMax}</p>
          <p><strong>Avg Query Latency:</strong> ${db.queryLatency}</p>
        </div>
      </div>
    `;
  }
}
