/**
 * API Keys & Secret Vault Module (Improved with Rotation Action & Events)
 * Path: admin/features/auth-security/modules/api-keys-secrets-module.js
 */

export class ApiKeysSecretsModule {
  render(container, core) {
    const secrets = core.getApiSecrets();
    
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔑 API Keys & Secret Vault</h4>
        <p style="font-size:13px; color:#586069;">Manage JWT tokens, encryption secrets, and key rotation schedules.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Secret Key ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Type</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Last Rotated</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
              <th style="padding:8px; border:1px solid #e1e4e8; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${secrets.map(s => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${s.keyId}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${s.type}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;" class="rotate-date-${s.keyId}">${s.lastRotated}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${s.status}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; text-align: right;">
                  <button class="btn-rotate" data-id="${s.keyId}" style="background: #0366d6; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Rotate Key</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  bindEvents(container, core, onUpdate) {
    container.querySelectorAll('.btn-rotate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const keyId = e.target.getAttribute('data-id');
        if (confirm(`Are you sure you want to rotate secret key ${keyId}?`)) {
          if (core.rotateApiSecret(keyId)) {
            this.render(container, core);
            this.bindEvents(container, core, onUpdate);
            if (typeof onUpdate === 'function') {
              onUpdate({ action: 'SECRET_ROTATED', keyId });
            }
          }
        }
      });
    });
  }
}
