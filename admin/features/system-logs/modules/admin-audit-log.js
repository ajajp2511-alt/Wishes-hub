export class AdminAuditLogModule {
  static render(container, core) {
    const logs = core.getAdminAuditLogs();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📜 Administrative Audit Trail</h4>
        <p style="font-size:13px; color:#586069;">Track privileged user actions, configuration modifications, and system edits.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Log ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Administrator</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Action Executed</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Details</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(l => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${l.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${l.admin}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${l.action}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${l.details}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${l.timestamp}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
