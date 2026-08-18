export class PricingPackagesModule {
  static render(container, core) {
    const pkgs = core.getPackages();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">💳 Pricing Packages & Subscription Tiers</h4>
        <p style="font-size:13px; color:#586069;">Configure plan tiers, pricing limits, and feature access permissions.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Package ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Plan Name</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Price</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Billing Cycle</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Features / Limits</th>
            </tr>
          </thead>
          <tbody>
            ${pkgs.map(p => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${p.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${p.name}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">₹${p.price}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${p.interval}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${p.limits}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
