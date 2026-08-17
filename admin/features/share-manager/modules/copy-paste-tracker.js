export class CopyPasteTrackerModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📋 Direct Copy-Paste URL Tracker</h4>
        <p style="font-size:13px; color:#586069;">Detect clipboard copy actions and attach default tracking parameters automatically.</p>
      </div>
    `;
  }
}
