export class ApiKeysSecretsModule {
  static render(container, core) {
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
            </tr>
          </thead>
          <tbody>
            ${secrets.map(s => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${s.keyId}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${s.type}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${s.lastRotated}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${s.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
