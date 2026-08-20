export class IpWhitelistModule {
  static render(container, core) {
    const list = core.getIpWhitelist();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🛡️ IP Whitelist & Firewall Filter</h4>
        <p style="font-size:13px; color:#586069;">Restrict admin access exclusively to trusted CIDR network ranges.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Rule ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Allowed IP Range</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Label / Description</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(i => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${i.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${i.ipRange}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${i.label}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${i.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
