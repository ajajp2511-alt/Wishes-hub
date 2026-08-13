export class FestivalSchedulerModule {
  static render(container, core) {
    const campaigns = core.getCampaigns();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Festival Blast Scheduler & Calendar</h4>
        <p style="font-size:13px; color:#586069;">Schedule automated festival blasts with timezone synchronization.</p>

        <div style="margin-top:15px;">
          <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
              <tr style="border-bottom:1px solid #e1e4e8; text-align:left;">
                <th style="padding:8px;">Campaign Name</th>
                <th style="padding:8px;">Channel</th>
                <th style="padding:8px;">Scheduled Date</th>
                <th style="padding:8px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${campaigns.map(c => `
                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:8px;"><strong>${c.name}</strong></td>
                  <td style="padding:8px;"><code>${c.channel}</code></td>
                  <td style="padding:8px;">${c.scheduledDate || 'N/A'}</td>
                  <td style="padding:8px;"><span style="color:${c.status === 'Completed' ? '#2da44e' : '#0366d6'};">${c.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}
