/**
 * Sub-Module: Referral Engine & Spin Wheel Configuration
 * Path: admin/features/gamification-rewards/modules/referral-spin.js
 */

export class ReferralSpinModule {
  static render(container, coreInstance) {
    const rewards = coreInstance.spinWheelSlices;
    container.innerHTML = `
      <div class="spin-panel" style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Referral Rewards & Lucky Spin Wheel</h4>
        <div style="margin-bottom:15px;">
          <label style="font-size:13px; font-weight:bold;">Referral Bonus Points (Per Invite):</label>
          <input type="number" id="inp-ref-points" value="${coreInstance.referralPoints}" style="padding:6px; border:1px solid #d1d5da; border-radius:4px; margin-left:10px; width:80px;" />
        </div>

        <h5>Lucky Wheel Rewards & Probabilities</h5>
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <thead>
            <tr style="border-bottom:1px solid #e1e4e8; text-align:left;">
              <th style="padding:8px;">Slice Name</th>
              <th style="padding:8px;">Reward Type</th>
              <th style="padding:8px;">Probability</th>
            </tr>
          </thead>
          <tbody>
            ${rewards.map(r => `
              <tr style="border-bottom:1px solid #f0f0f0;">
                <td style="padding:8px;"><strong>${r.label}</strong></td>
                <td style="padding:8px;"><code>${r.type}</code></td>
                <td style="padding:8px;">${r.probability}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
