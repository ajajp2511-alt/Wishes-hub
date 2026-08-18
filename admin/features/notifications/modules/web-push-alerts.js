export class WebPushAlertsModule {
  static render(container, core) {
    const subs = core.getSubscribers();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔔 Web Push Alerts & Tokens</h4>
        <p style="font-size:13px; color:#586069;">Manage active push subscriber tokens and browser permissions.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Sub ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Device & Browser</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Region</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Language</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${subs.map(s => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${s.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${s.device}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${s.region}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${s.language.toUpperCase()}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${s.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
