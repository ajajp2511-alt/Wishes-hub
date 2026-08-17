export class WhatsappScriptsModule {
  static render(container, core) {
    const tpls = core.getTemplates().filter(t => t.target === 'WhatsApp');
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">💬 WhatsApp Scripts & Pre-filled Messaging Engine</h4>
        <p style="font-size:13px; color:#586069;">Configure one-click WhatsApp share parameters, formatting, and group triggers.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Template Name</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Formatted Message</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Total Shares</th>
            </tr>
          </thead>
          <tbody>
            ${tpls.map(t => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${t.name}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${t.text}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${t.shares.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
