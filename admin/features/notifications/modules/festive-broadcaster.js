export class FestiveBroadcasterModule {
  static render(container, core) {
    const campaigns = core.getCampaigns();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🎉 Festive Broadcaster Scheduler</h4>
        <p style="font-size:13px; color:#586069;">Schedule automated push notification broadcasts for upcoming festivals.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Campaign ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Campaign Name</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Scheduled Time</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Recipients</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${campaigns.map(c => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${c.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${c.name}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${c.schedule}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${c.sentCount.toLocaleString()}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; font-weight:bold;">${c.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
