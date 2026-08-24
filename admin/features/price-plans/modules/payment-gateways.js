export class PaymentGatewaysModule {
  static render(container, core) {
    const gateways = core.getGateways();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔌 Payment Gateways Configuration</h4>
        <p style="font-size:13px; color:#586069;">Manage Razorpay, PhonePe, UPI & Stripe payment credentials.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Gateway Name</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Environment</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${gateways.map(g => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${g.name}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${g.mode}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; font-weight:bold;">${g.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
