export class PremiumStoreModule {
  static render(container, core) {
    const items = core.getTemplates();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4>Premium Templates Store & Pricing Engine</h4>
        <table style="width:100%; border-collapse:collapse; font-size:13px; margin-top:10px;">
          <thead>
            <tr style="border-bottom:1px solid #e1e4e8; text-align:left;">
              <th style="padding:8px;">Template Name</th>
              <th style="padding:8px;">Creator</th>
              <th style="padding:8px;">Price</th>
              <th style="padding:8px;">Sales</th>
              <th style="padding:8px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(t => `
              <tr style="border-bottom:1px solid #f0f0f0;">
                <td style="padding:8px;"><strong>${t.name}</strong></td>
                <td style="padding:8px;">${t.creator}</td>
                <td style="padding:8px; color:#0366d6;">₹${t.price}</td>
                <td style="padding:8px;">${t.sales}</td>
                <td style="padding:8px;"><span style="color:#2da44e;">${t.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
