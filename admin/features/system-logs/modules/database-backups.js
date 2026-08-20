export class DatabaseBackupsModule {
  static render(container, core) {
    const backups = core.getDatabaseBackups();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">💾 Database Backups & Snapshots</h4>
        <p style="font-size:13px; color:#586069;">Monitor automated database backup schedules, sizes, and restore points.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Backup ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Backup Type</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Archive Size</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Created At</th>
            </tr>
          </thead>
          <tbody>
            ${backups.map(b => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${b.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${b.type}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${b.size}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${b.status}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${b.timestamp}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
