export class AbuseSpamProtectionModule {
  static render(container, core) {
    const flagged = core.getFlaggedContent();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🚨 Abuse, Spam & Profanity Moderation</h4>
        <p style="font-size:13px; color:#586069;">Review user-reported greeting cards, spam links, and automated filters.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Flag ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Target Content</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Flag Reason</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Severity</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Action Status</th>
            </tr>
          </thead>
          <tbody>
            ${flagged.map(f => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${f.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${f.target}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${f.reason}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:${f.severity === 'High' ? '#d73a49' : '#e36209'}; font-weight:bold;">${f.severity}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${f.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
