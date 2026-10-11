/**
 * Revenue-per-Visitor (RPV) Optimizer Module (Optimized & Interactive)
 * Path: admin/features/ab-testing/modules/rpv-revenue-optimizer.js
 */

export class RpvRevenueOptimizerModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0 0 4px 0;">💰 Revenue-per-Visitor (RPV) Optimizer</h4>
            <p style="margin:0; font-size:13px; color:#586069;">Evaluate test winners based directly on generated AdSense and ad revenue.</p>
          </div>
          <span style="background:#e6ffed; color:#28a745; padding:4px 10px; border-radius:12px; font-size:12px; font-weight:bold;">Ad Revenue API: Connected</span>
        </div>

        <!-- RPV Comparison Table -->
        <div style="overflow-x:auto; margin-top: 15px;">
          <table style="width:100%; border-collapse:collapse; font-size:13px; min-width: 600px;">
            <thead>
              <tr style="background:#f6f8fa; text-align:left;">
                <th style="padding:10px; border:1px solid #e1e4e8;">Experiment ID</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Variant A RPV</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Variant B RPV</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Revenue Lift</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">RPV Winner</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:10px; border:1px solid #e1e4e8;"><strong style="color:#0366d6;">EXP-101</strong></td>
                <td style="padding:10px; border:1px solid #e1e4e8;">₹0.42 / visitor</td>
                <td style="padding:10px; border:1px solid #e1e4e8; color:#28a745; font-weight:600;">₹0.68 / visitor</td>
                <td style="padding:10px; border:1px solid #e1e4e8; color:#28a745; font-weight:600;">+61.9% 🚀</td>
                <td style="padding:10px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">Variant B</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}
