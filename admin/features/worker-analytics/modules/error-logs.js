export class ErrorLogsModule {
  static render(container, core) {
    const errors = core.getRecentErrors();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📜 Worker Execution Error Logs</h4>
        <p style="font-size:13px; color:#586069;">Real-time exceptions, subrequest failures, and worker runtime timeouts.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Error Code</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Worker File</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Message</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${errors.map(e => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code style="color:#d73a49;">${e.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${e.worker}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${e.message}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${e.timestamp}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
