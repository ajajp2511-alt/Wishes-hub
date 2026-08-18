export class SystemAlertsWebhooksModule {
  static render(container, core) {
    const alerts = core.getActiveAlerts();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🚨 System Alerts & Incident Webhooks</h4>
        <p style="font-size:13px; color:#586069;">Active infrastructure incidents and alert broadcast channels.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Alert ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Severity</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Target System</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Details</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${alerts.map(a => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${a.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#b08800; font-weight:bold;">${a.type}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${a.target}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${a.message}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${a.time}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
