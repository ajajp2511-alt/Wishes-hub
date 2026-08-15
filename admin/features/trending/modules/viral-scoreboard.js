export class ViralScoreboardModule {
  static render(container, core) {
    const list = core.getLeaderboard();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔥 Real-Time Viral Scoreboard</h4>
        <p style="font-size:13px; color:#586069;">Live rankings based on aggregate views, shares, and engagement rates.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Template</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Viral Score</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Shares</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Views</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(item => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${item.name}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#0088cc; font-weight:bold;">${item.viralScore}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${item.shares}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${item.views}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
