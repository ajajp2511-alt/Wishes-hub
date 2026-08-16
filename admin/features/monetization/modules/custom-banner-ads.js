export class CustomBannerAdsModule {
  static render(container, core) {
    const campaigns = core.getCampaigns();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🖼️ Custom Sponsor & Direct Banner Manager</h4>
        <p style="font-size:13px; color:#586069;">Upload target destination URLs, banner media, and direct ad campaigns.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Sponsor</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Type</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Delivered / Cap</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${campaigns.map(c => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${c.sponsor}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${c.type}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${c.impressions} / ${c.limit}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:${c.status === 'Running' ? '#28a745' : '#e67e22'}; font-weight:bold;">${c.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
