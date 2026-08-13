export class PayoutsCommissionsModule {
  static render(container, core) {
    const list = core.getPayouts();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4>Payouts, Commissions & Royalty Splits</h4>
        <div style="margin-top:10px;">
          ${list.map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border:1px solid #e1e4e8; border-radius:6px;">
              <div>
                <strong>${p.creator}</strong> (UPI: <code>${p.bankUpi}</code>)
                <div style="color:#2da44e; font-weight:bold;">Payout Amount: ₹${p.amount}</div>
              </div>
              <button class="btn-payout" data-creator="${p.creator}" style="padding:6px 12px; background:#0366d6; color:#fff; border:none; border-radius:4px; cursor:pointer;">
                ${p.status === 'Completed' ? 'Paid' : 'Release Payment'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
