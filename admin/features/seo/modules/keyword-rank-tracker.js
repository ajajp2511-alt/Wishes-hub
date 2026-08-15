export class KeywordRankTrackerModule {
  static render(container, core) {
    const keywords = core.getKeywords();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📈 Keyword Rank Tracker</h4>
        <p style="font-size:13px; color:#586069;">Track organic Google search rankings for festive keywords.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Keyword</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Google Rank</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Traffic/mo</th>
            </tr>
          </thead>
          <tbody>
            ${keywords.map(k => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${k.keyword}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">#${k.rank}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${k.traffic}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
