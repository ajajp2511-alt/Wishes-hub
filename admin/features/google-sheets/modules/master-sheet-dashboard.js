export class MasterSheetDashboardModule {
  static render(container, core) {
    const sheets = core.getConnectedSheets();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📊 Master Google Sheet Dashboard</h4>
        <p style="font-size:13px; color:#586069;">Inspect connected Google Spreadsheets, active tabs, and live data rows.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Sheet ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Spreadsheet Title</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Total Rows</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Last Synced</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${sheets.map(s => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${s.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${s.name}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${s.rows.toLocaleString()}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${s.lastSynced}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${s.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
