/**
 * Active Sessions Desk Module (Improved & Scoped)
 * Path: admin/features/auth-security/modules/active-sessions-desk-module.js
 */

export class ActiveSessionsDeskModule {
  constructor() {
    this.sessions = [
      { id: 'SES-01', device: 'Chrome on Windows', ip: '192.168.1.15', lastActive: '2 mins ago', current: true },
      { id: 'SES-02', device: 'Safari on iPhone', ip: '49.36.210.12', lastActive: '1 hour ago', current: false }
    ];
  }

  render(container, authCore) {
    this.container = container;
    this.authCore = authCore;
    this.renderUI();
  }

  renderUI() {
    if (!this.container) return;

    const rows = this.sessions.map(s => `
      <tr style="border-bottom: 1px solid #e1e4e8;">
        <td style="padding: 10px; color:#f0f6fc;">${s.device} ${s.current ? '<span style="color: #28a745; font-size: 11px; font-weight: bold;">(Current)</span>' : ''}</td>
        <td style="padding: 10px; color: #8b949e;">${s.ip}</td>
        <td style="padding: 10px; color: #8b949e;">${s.lastActive}</td>
        <td style="padding: 10px; text-align: right;">
          ${!s.current ? `<button class="btn-revoke" data-id="${s.id}" style="background: #d73a49; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Revoke</button>` : '-'}
        </td>
      </tr>
    `).join('');

    this.container.innerHTML = `
      <div style="background:#161b22; border:1px solid #30363d; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0; color:#f0f6fc;">💻 Active Logged-in Sessions & Remote Logout Desk</h4>
        <p style="font-size:13px; color:#8b949e; margin-bottom: 15px;">Monitor live active sessions and force immediate remote logout.</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background: #21262d; text-align: left; border-bottom: 1px solid #30363d; color:#f0f6fc;">
              <th style="padding: 10px;">Device / Browser</th>
              <th style="padding: 10px;">IP Address</th>
              <th style="padding: 10px;">Last Active</th>
              <th style="padding: 10px; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows : '<tr><td colspan="4" style="padding:15px; text-align:center; color:#8b949e;">No active remote sessions found.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;

    this.container.querySelectorAll('.btn-revoke').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sessionId = e.target.getAttribute('data-id');
        this.sessions = this.sessions.filter(s => s.id !== sessionId);
        
        // Re-render UI to update table cleanly
        this.renderUI();
      });
    });
  }
}

export const ActiveSessionsDeskModuleInstance = new ActiveSessionsDeskModule();
