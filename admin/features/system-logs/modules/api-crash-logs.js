export class ApiCrashLogsModule {
  static render(container, core) {
    const crashes = core.getApiCrashLogs();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">💥 API Crashes & Exception Diagnostics</h4>
        <p style="font-size:13px; color:#586069;">Inspect 5xx HTTP server errors, stack traces, and error frequencies.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Error ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Endpoint Route</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Exception Message</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Count</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Last Occurred</th>
            </tr>
          </thead>
          <tbody>
            ${crashes.map(c => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${c.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${c.endpoint}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#d73a49;"><b>${c.error}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${c.occurrences}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${c.timestamp}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
