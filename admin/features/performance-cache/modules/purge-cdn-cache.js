export class PurgeCdnCacheModule {
  static render(container, core) {
    const logs = core.getCdnLogs();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⚡ Purge Edge CDN Cache</h4>
        <p style="font-size:13px; color:#586069;">Flush global Vercel/Cloudflare edge cache instantly across all regions.</p>

        <div style="margin:15px 0;">
          <button style="background:#d73a49; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:bold;">
            Purge All Cache Entirely
          </button>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Log ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Purge Target</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(l => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${l.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${l.target}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${l.status}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${l.timestamp}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
