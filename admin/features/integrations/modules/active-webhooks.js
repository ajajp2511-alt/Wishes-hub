export class ActiveWebhooksModule {
  static render(container, core) {
    const webhooks = core.getActiveWebhooks();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⚡ Active Webhooks & Listeners</h4>
        <p style="font-size:13px; color:#586069;">Monitor outgoing real-time event webhooks and trigger endpoints.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Webhook Name</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Target Endpoint URL</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Events</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${webhooks.map(w => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${w.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${w.name}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${w.url}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${w.events.join(', ')}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${w.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
