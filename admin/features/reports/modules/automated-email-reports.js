export class AutomatedEmailReportsModule {
  static render(container, core) {
    const reports = core.getScheduledReports();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📧 Automated Email Reports Scheduler</h4>
        <p style="font-size:13px; color:#586069;">Schedule recurring email reports to be delivered to admin inboxes.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Report Name</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Frequency</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Recipient</th>
            </tr>
          </thead>
          <tbody>
            ${reports.map(r => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${r.name}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${r.frequency}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${r.recipient}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
