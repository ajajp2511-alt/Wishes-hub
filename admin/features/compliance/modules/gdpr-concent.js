export class GdprConsentModule {
  static render(container, core) {
    const requests = core.getGdprRequests();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🛡️ GDPR & User Privacy Consent Management</h4>
        <p style="font-size:13px; color:#586069;">Handle data export requests and account erasure workflows.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Request ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">User Email</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Request Type</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${requests.map(r => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${r.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${r.user}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${r.type}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:${r.status === 'Completed' ? '#28a745' : '#b08800'}; font-weight:bold;">${r.status}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${r.timestamp}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
