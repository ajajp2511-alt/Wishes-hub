/**
 * IP Whitelist & Firewall Filter Module (Improved with Add/Remove Actions)
 * Path: admin/features/auth-security/modules/ip-whitelist-module.js
 */

export class IpWhitelistModule {
  render(container, core) {
    const list = core.getIpWhitelist();
    
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0; font-size: 16px;">🛡️ IP Whitelist & Firewall Filter</h4>
            <p style="font-size:13px; color:#586069; margin: 5px 0 0 0;">Restrict admin access exclusively to trusted CIDR network ranges.</p>
          </div>
          <button id="btn-add-ip" style="background: #2ea44f; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 500;">+ Add IP / CIDR</button>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Rule ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Allowed IP Range</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Label / Description</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
              <th style="padding:8px; border:1px solid #e1e4e8; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(i => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${i.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${i.ipRange}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${i.label}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${i.status}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; text-align: right;">
                  <button class="btn-remove-ip" data-id="${i.id}" style="background: transparent; color: #d73a49; border: 1px solid #d73a49; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Revoke</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  bindEvents(container, core, onUpdate) {
    const addBtn = container.querySelector('#btn-add-ip');
    addBtn?.addEventListener('click', () => {
      const ipRange = prompt('Enter IP or CIDR Range (e.g., 192.168.1.0/24):');
      if (!ipRange) return;
      const label = prompt('Enter Label / Description (e.g., Office VPN):') || 'Custom IP';

      const newRule = {
        id: `IP-RULE-0${core.getIpWhitelist().length + 1}`,
        ipRange: ipRange,
        label: label,
        status: 'Active'
      };

      if (core.addIpWhitelistRule(newRule)) {
        this.render(container, core);
        this.bindEvents(container, core, onUpdate);
        if (typeof onUpdate === 'function') onUpdate({ action: 'IP_RULE_ADDED', rule: newRule });
      }
    });

    container.querySelectorAll('.btn-remove-ip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ruleId = e.target.getAttribute('data-id');
        if (confirm(`Are you sure you want to remove rule ${ruleId}?`)) {
          core.removeIpWhitelistRule(ruleId);
          this.render(container, core);
          this.bindEvents(container, core, onUpdate);
          if (typeof onUpdate === 'function') onUpdate({ action: 'IP_RULE_REMOVED', ruleId });
        }
      });
    });
  }
}
