/**
 * API Keys & Secret Vault Module (Improved with Auto-Binding & Theme Sync)
 * Path: admin/features/auth-security/modules/api-keys-secrets-module.js
 */

export class ApiKeysSecretsModule {
  render(container, core, onUpdate) {
    this.container = container;
    this.core = core;
    this.onUpdate = onUpdate;
    this.renderUI();
  }

  renderUI() {
    if (!this.container || !this.core) return;
    const secrets = this.core.getApiSecrets();
    
    this.container.innerHTML = `
      <div style="background:#161b22; border:1px solid #30363d; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0; color:#f0f6fc;">🔑 API Keys & Secret Vault</h4>
        <p style="font-size:13px; color:#8b949e;">Manage JWT tokens, encryption secrets, and key rotation schedules.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#21262d; text-align:left; color:#f0f6fc;">
              <th style="padding:10px; border:1px solid #30363d;">Secret Key ID</th>
              <th style="padding:10px; border:1px solid #30363d;">Type</th>
              <th style="padding:10px; border:1px solid #30363d;">Last Rotated</th>
              <th style="padding:10px; border:1px solid #30363d;">Status</th>
              <th style="padding:10px; border:1px solid #30363d; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${secrets.map(s => `
              <tr>
                <td style="padding:10px; border:1px solid #30363d;"><code style="color:#58a6ff;">${s.keyId}</code></td>
                <td style="padding:10px; border:1px solid #30363d; color:#f0f6fc;"><b>${s.type}</b></td>
                <td style="padding:10px; border:1px solid #30363d; color:#8b949e;">${s.lastRotated}</td>
                <td style="padding:10px; border:1px solid #30363d; color:#2ea043; font-weight:bold;">${s.status}</td>
                <td style="padding:10px; border:1px solid #30363d; text-align: right;">
                  <button class="btn-rotate" data-id="${s.keyId}" style="background: #1f6feb; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;">Rotate Key</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;

    this.container.querySelectorAll('.btn-rotate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const keyId = e.target.getAttribute('data-id');
        if (confirm(`Are you sure you want to rotate secret key ${keyId}?`)) {
          if (this.core.rotateApiSecret(keyId)) {
            this.renderUI(); // Re-render with updated state
            if (typeof this.onUpdate === 'function') {
              this.onUpdate({ action: 'SECRET_ROTATED', keyId });
            }
          }
        }
      });
    });
  }
}

export const ApiKeysSecretsModuleInstance = new ApiKeysSecretsModule();
