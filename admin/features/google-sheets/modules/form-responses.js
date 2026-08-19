export class FormResponsesModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📝 Integrated Form Responses Inbox</h4>
        <p style="font-size:13px; color:#586069;">Incoming Google Forms submissions streaming directly into spreadsheet rows.</p>
      </div>
    `;
  }
}
