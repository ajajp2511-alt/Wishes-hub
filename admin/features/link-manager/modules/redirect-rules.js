export class RedirectRulesModule {
  static render(container, core) {
    const rules = core.getRedirectRules();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔄 Dynamic Redirect Rules Engine</h4>
        <p style="font-size:13px; color:#586069;">Manage 301/302 redirects, post-event forwarding, and dynamic link routing.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Source Path</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Target Destination</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Redirect Type</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rules.map(r => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${r.source}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${r.destination}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${r.type}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${r.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
