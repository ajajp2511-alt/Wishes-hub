export class ExportAuditLogsModule {
  static render(container, core) {
    const logs = core.getAuditLogs();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🛡️ Security Audit & Export Logs</h4>
        <p style="font-size:13px; color:#586069;">Track history of data exports, downloads, and compliance access details.</p>

        <div style="margin-top:15px; font-size:13px;">
          ${logs.map(l => `
            <div style="padding:8px; border-bottom:1px solid #eee;">
              <strong>${l.user}</strong>: ${l.action} <span style="color:#888; font-size:11px;">(${l.timestamp})</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
