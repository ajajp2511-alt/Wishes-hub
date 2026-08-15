export class DataRetentionArchiverModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📦 Data Retention & DB Archiver</h4>
        <p style="font-size:13px; color:#586069;">Auto-archive historical logs older than 90 days to maintain fast database queries.</p>
      </div>
    `;
  }
}
