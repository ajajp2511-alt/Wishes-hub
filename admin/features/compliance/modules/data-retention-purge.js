export class DataRetentionPurgeModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🗑️ Data Retention & Auto-Purge Scheduler</h4>
        <p style="font-size:13px; color:#586069;">Automate expiration and permanent removal of stale logs and inactive accounts.</p>
      </div>
    `;
  }
}
