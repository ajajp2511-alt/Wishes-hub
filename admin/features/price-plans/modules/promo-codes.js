export class PromoCodesModule {
  static render(container, core) {
    const promos = core.getPromos();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🏷️ Promo Codes & Festive Vouchers</h4>
        <p style="font-size:13px; color:#586069;">Manage discount coupons, usage caps, and festive promotional offers.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Coupon Code</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Discount</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Usage Limit</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${promos.map(pr => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${pr.code}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${pr.discount}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${pr.usageLimit.toLocaleString()}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${pr.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
