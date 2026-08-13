/**
 * Sub-Module: Points Redemption & Voucher Store
 * Path: admin/features/gamification-rewards/modules/redeem-store.js
 */

export class RedeemStoreModule {
  static render(container, coreInstance) {
    const storeItems = coreInstance.getStoreItems();
    container.innerHTML = `
      <div class="store-panel" style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">XP Redemption & Voucher Marketplace</h4>
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <thead>
            <tr style="border-bottom:1px solid #e1e4e8; text-align:left;">
              <th style="padding:8px;">Reward Perk</th>
              <th style="padding:8px;">Cost (XP)</th>
              <th style="padding:8px;">Availability</th>
            </tr>
          </thead>
          <tbody>
            ${storeItems.map(item => `
              <tr style="border-bottom:1px solid #f0f0f0;">
                <td style="padding:8px;"><strong>${item.title}</strong></td>
                <td style="padding:8px; color:#0366d6; font-weight:bold;">${item.costXP} XP</td>
                <td style="padding:8px;"><code>${item.stock} Left</code></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
