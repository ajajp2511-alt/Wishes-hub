export class LogAlertTriggersModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🚨 Log Search Engine & Alert Triggers</h4>
        <p style="font-size:13px; color:#586069;">Full-text log search with regex filters and threshold breach notifications.</p>
      </div>
    `;
  }
}
