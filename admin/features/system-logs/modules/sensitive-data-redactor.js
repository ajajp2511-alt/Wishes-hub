export class SensitiveDataRedactorModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🙈 Sensitive PII Data Redactor & Masker</h4>
        <p style="font-size:13px; color:#586069;">Automatically mask API keys, tokens, and personal information in system logs.</p>
      </div>
    `;
  }
}
