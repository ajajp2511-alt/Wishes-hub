/**
 * Active Sessions Desk Module (Fixed & Optimized)
 * Path: admin/features/auth-security/modules/active-sessions-desk.js
 */

export class ActiveSessionsDeskModule {
  static sessions = [
    { id: 'SES-01', device: 'Chrome on Windows', ip: '192.168.1.15', lastActive: '2 mins ago', current: true },
    { id: 'SES-02', device: 'Safari on iPhone', ip: '49.36.210.12', lastActive: '1 hour ago', current: false },
    { id: 'SES-03', device: 'Firefox on Linux', ip: '10.0.0.4', lastActive: '3 hours ago', current: false }
  ];

  static render(container, authCore) {
    this.container = container;
    this.authCore = authCore;
    this.renderUI();
  }

  static renderUI() {
    if (!this.container) return;

    const rows = this.sessions.map(s => `
      <tr style="border-bottom: 1px solid #30363d; transition: background 0.2s;">
        <td style="padding: 12px 10px; color:#f0f6fc;">
          ${s.device} 
          ${s.current ? '<span style="background: #2ea44f22; color: #28a745; border: 1px solid #2ea44f44; padding: 2px 6px; border-radius: 12px; font-size: 10px; font-weight: bold; margin-left: 6px;">Current Session</span>' : ''}
        </td>
        <td style="padding: 12px 10px; color: #8b949e; font-family: monospace;">${s.ip}</td>
        <td style="padding: 12px 10px; color: #8b949e;">${s.lastActive}</td>
        <td style="padding: 12px 10px; text-align: right;">
          ${!s.current ? `<button class="btn-revoke" data-id="${s.id}" style="background: #d73a49; color: #fff; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;">Revoke</button>` : '<span style="color: #8b949e; font-size: 12px;">Protected</span>'}
        </td>
      </tr>
    `).join('');

    this.container.innerHTML = `
      <div style="background:#161b22; border:1px solid #30363d; padding:20px; border-radius:8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0 0 4px 0; color:#f0f6fc; font-size: 16px;">💻 Active Logged-in Sessions & Remote Logout Desk</h4>
            <p style="font-size:13px; color:#8b949e; margin:0;">Monitor live active sessions across devices and force immediate remote logout.</p>
          </div>
          <button id="btn-revoke-all" style="background: #21262d; border: 1px solid #30363d; color: #f85149; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Revoke All Other Sessions</button>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; min-width: 550px;">
            <thead>
              <tr style="background: #21262d; text-align: left; border-bottom: 1px solid #30363d; color:#f0f6fc;">
                <th style="padding: 10px;">Device / Browser</th>
                <th style="padding: 10px;">IP Address</th>
                <th style="padding: 10px;">Last Active</th>
                <th style="padding: 10px; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length ? rows : '<tr><td colspan="4" style="padding:20px; text-align:center; color:#8b949e;">No active remote sessions found.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  static bindEvents() {
    if (!this.container) return;

    // Revoke individual session
    this.container.querySelectorAll('.btn-revoke').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sessionId = e.target.getAttribute('data-id');
        this.sessions = this.sessions.filter(s => s.id !== sessionId);
        this.renderUI();
      });
    });

    // Revoke all other sessions
    const revokeAllBtn = this.container.querySelector('#btn-revoke-all');
    if (revokeAllBtn) {
      revokeAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out from all other devices?')) {
          this.sessions = this.sessions.filter(s => s.current);
          this.renderUI();
        }
      });
    }
  }

  static destroy() {
    this.container = null;
  }
}
