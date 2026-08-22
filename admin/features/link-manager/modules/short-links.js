export class ShortLinksModule {
  static render(container, core) {
    const links = core.getShortLinks();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔗 Branded Short Links Manager</h4>
        <p style="font-size:13px; color:#586069;">Create, manage, and monitor custom branded short links and click metrics.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Short URL</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Original Destination</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Clicks</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${links.map(l => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>https://${l.domain}/${l.slug}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8; max-width:200px; overflow:hidden; text-overflow:ellipsis;">${l.originalUrl}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${l.clicks.toLocaleString()}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${l.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  }
