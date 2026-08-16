export class ExperimentRollbackHistoryModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⏮️ Test Archive & Quick Rollback Guard</h4>
        <p style="font-size:13px; color:#586069;">Revert layouts instantly to historical winning variants with a single click.</p>
      </div>
    `;
  }
}
