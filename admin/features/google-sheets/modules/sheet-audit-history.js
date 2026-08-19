export class SheetAuditHistoryModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📜 Sheet Audit Logs & Change History</h4>
        <p style="font-size:13px; color:#586069;">Track manual cell overrides, deleted rows, and sheet edits across versions.</p>
      </div>
    `;
  }
}
