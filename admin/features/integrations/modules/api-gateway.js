export class ApiGatewayModule {
  static render(container, core) {
    const keys = core.getApiKeys();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔑 API Gateway & Keys Control</h4>
        <p style="font-size:13px; color:#586069;">Manage client API access tokens, request limits, and CORS origins.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Key ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Client Name</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Permission Scope</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Rate Limit</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${keys.map(k => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${k.keyId}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${k.name}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${k.scope}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${k.rateLimit}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${k.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
