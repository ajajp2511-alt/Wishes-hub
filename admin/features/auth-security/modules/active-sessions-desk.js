export class ActiveSessionsDeskModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">💻 Active Logged-in Sessions & Remote Logout Desk</h4>
        <p style="font-size:13px; color:#586069;">Monitor live active sessions and force immediate remote logout.</p>
      </div>
    `;
  }
}
