export class CommentModerationModule {
  static render(container, core) {
    const comments = core.getComments();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🛡️ Public Comment Moderation Queue</h4>
        <p style="font-size:13px; color:#586069;">Review, approve, or spam-block public comments on greeting cards.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Card Title</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Comment Text</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Sentiment</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${comments.map(c => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${c.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${c.card}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">"${c.text}"</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${c.sentiment}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; font-weight:bold;">${c.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
