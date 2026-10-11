/**
 * IP Whitelist & Firewall Filter Module (Optimized & Bug-Fixed)
 * Path: admin/features/auth-security/modules/ip-whitelist.js
 */

export class IpWhitelistModule {
  static container = null;
  static core = null;
  static onUpdate = null;

  static render(container, core, onUpdate) {
    this.container = container;
    this.core = core;
    this.onUpdate = onUpdate;
    this.renderUI();
  }

  static renderUI() {
    if (!this.container || !this.core) return;
    const list = this.core.getIpWhitelist();
    
    this.container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 style="margin:0; font-size: 16px; color: #24292e;">🛡️ IP Whitelist & Firewall Filter</h4>
            <p style="font-size:13px; color:#586069; margin: 5px 0 0 0;">Restrict admin access exclusively to trusted CIDR network ranges.</p>
          </div>
          <button id="btn-add-ip" style="background: #2ea44f; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 500;">+ Add IP / CIDR</button>
        </div>

        <div style="overflow-x: auto;">
          <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px; min-width: 600px;">
            <thead>
              <tr style="background:#f6f8fa; text-align:left;">
                <th style="padding:8px; border:1px solid #e1e4e8; color: #24292e;">Rule ID</th>
                <th style="padding:8px; border:1px solid #e1e4e8; color: #24292e;">Allowed IP Range</th>
                <th style="padding:8px; border:1px solid #e1e4e8; color: #24292e;">Label / Description</th>
                <th style="padding:8px; border:1px solid #e1e4e8; color: #24292e;">Status</th>
                <th style="padding:8px; border:1px solid #e1e4e8; text-align: right; color: #24292e;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${list.length ? list.map(i => `
                <tr>
                  <td style="padding:8px; border:1px solid #e1e4e8;"><code style="font-family: monospace;">${i.id}</code></td>
                  <td style="padding:8px; border:1px solid #e1e4e8;"><code style="color:#0366d6; font-family: monospace;">${i.ipRange}</code></td>
                  <td style="padding:8px; border:1px solid #e1e4e8;"><b>${i.label}</b></td>
                  <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${i.status || 'Whitelisted'}</td>
                  <td style="padding:8px; border:1px solid #e1e4e8; text-align: right;">
                    <button class="btn-remove-ip" data-id="${i.id}" style="background: transparent; color: #d73a49; border: 1px solid #d73a49; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 500;">Revoke</button>
                  </td>
                </tr>
              `).join('') : '<tr><td colspan="5" style="padding:15px; text-align:center; color:#586069;">No IP whitelist rules defined.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  static bindEvents() {
    if (!this.container || !this.core) return;

    const addBtn = this.container.querySelector('#btn-add-ip');
    addBtn?.addEventListener('click', () => {
      const ipRange = prompt('Enter IP or CIDR Range (e.g., 192.168.1.0/24):');
      if (!ipRange || ipRange.trim() === '') return;
      const label = prompt('Enter Label / Description (e.g., Office VPN):') || 'Custom IP';

      const newRule = {
        id: `IP-${Date.now().toString().slice(-4)}`,
        ipRange: ipRange.trim(),
        label: label.trim(),
        status: 'Whitelisted'
      };

      const result = this.core.addIpEntry(newRule);
      if (result.success) {
        this.renderUI();
        if (typeof this.onUpdate === 'function') {
          this.onUpdate({ action: 'IP_RULE_ADDED', rule: newRule });
        }
      } else {
        alert(result.message);
      }
    });

    this.container.querySelectorAll('.btn-remove-ip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ruleId = e.target.getAttribute('data-id');
        if (confirm(`Are you sure you want to remove IP rule ${ruleId}?`)) {
          const result = this.core.removeIpEntry(ruleId);
          if (result.success) {
            this.renderUI();
            if (typeof this.onUpdate === 'function') {
              this.onUpdate({ action: 'IP_RULE_REMOVED', ruleId });
            }
          } else {
            alert(result.message);
          }
        }
      });
    });
  }

  static destroy() {
    this.container = null;
    this.core = null;
    this.onUpdate = null;
  }
}
