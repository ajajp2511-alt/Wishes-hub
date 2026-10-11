/**
 * API Keys & Secret Vault Module (Optimized & Bug-Fixed)
 * Path: admin/features/auth-security/modules/api-keys-secrets.js
 */

export class ApiKeysSecretsModule {
  static render(container, core, onUpdate) {
    this.container = container;
    this.core = core;
    this.onUpdate = onUpdate;
    this.renderUI();
  }

  static renderUI() {
    if (!this.container || !this.core) return;
    const secrets = this.core.getApiSecrets();
    
    this.container.innerHTML = `
      <div style="background:#161b22; border:1px solid #30363d; padding:20px; border-radius:8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h4 style="margin-top:0; color:#f0f6fc; font-size: 16px;">🔑 API Keys & Secret Vault</h4>
        <p style="font-size:13px; color:#8b949e; margin-bottom: 15px;">Manage JWT tokens, encryption secrets, and key rotation schedules securely.</p>

        <div style="overflow-x: auto;">
          <table style="width:100%; border-collapse:collapse; font-size:13px; min-width: 550px;">
            <thead>
              <tr style="background:#21262d; text-align:left; color:#f0f6fc; border-bottom: 1px solid #30363d;">
                <th style="padding: 10px;">Secret Key ID</th>
                <th style="padding: 10px;">Type</th>
                <th style="padding: 10px;">Last Rotated</th>
                <th style="padding: 10px;">Status</th>
                <th style="padding: 10px; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${secrets.map(s => `
                <tr style="border-bottom: 1px solid #30363d; transition: background 0.2s;">
                  <td style="padding: 10px;"><code style="color:#58a6ff; font-family: monospace;">${s.keyId}</code></td>
                  <td style="padding: 10px; color:#f0f6fc;"><b>${s.type}</b></td>
                  <td style="padding: 10px; color:#8b949e;">${s.lastRotated}</td>
                  <td style="padding: 10px; color:#2ea043; font-weight:bold;">${s.status}</td>
                  <td style="padding: 10px; text-align: right;">
                    <button class="btn-rotate" data-id="${s.keyId}" style="background: #1f6feb; color: #fff; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;">Rotate Key</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  static bindEvents() {
    if (!this.container) return;

    this.container.querySelectorAll('.btn-rotate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const keyId = e.target.getAttribute('data-id');
        if (confirm(`Are you sure you want to rotate secret key ${keyId}?`)) {
          const result = this.core.rotateApiSecret(keyId);
          if (result.success) {
            this.renderUI(); // Re-render with updated state
            if (typeof this.onUpdate === 'function') {
              this.onUpdate({ action: 'SECRET_ROTATED', keyId });
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
