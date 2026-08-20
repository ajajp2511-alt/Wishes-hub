export class SecurityAuthLogsModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔐 Security & Authentication Access Logs</h4>
        <p style="font-size:13px; color:#586069;">Monitor failed admin logins, password resets, and MFA challenge history.</p>
      </div>
    `;
  }
}
