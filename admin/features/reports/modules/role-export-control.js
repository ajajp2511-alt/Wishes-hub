export class RoleExportControlModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔐 Role-Based Access & Data Masking</h4>
        <p style="font-size:13px; color:#586069;">Set download permissions and hash PII data based on admin roles.</p>
      </div>
    `;
  }
}
