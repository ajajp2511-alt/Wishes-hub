/**
 * Auto-Winner Promoter Engine Module (Optimized & Interactive)
 * Path: admin/features/ab-testing/modules/auto-winner-promoter.js
 */

export class AutoWinnerPromoterModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0 0 4px 0;">🏆 Auto-Winner Promoter Engine</h4>
            <p style="margin:0; font-size:13px; color:#586069;">Automatically roll out the winning variant to 100% traffic upon reaching 95%+ confidence.</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 13px; font-weight: 600; color: #24292e;">Auto-Promote Status:</span>
            <button id="btn-toggle-autopilot" style="background:#2ea44f; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:600;">Enabled (Active)</button>
          </div>
        </div>

        <h5 style="margin: 20px 0 10px 0; font-size: 14px; color: #24292e;">📜 Recent Auto-Promotion Logs</h5>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
              <tr style="background:#f6f8fa; text-align:left;">
                <th style="padding:8px; border:1px solid #e1e4e8;">Experiment ID</th>
                <th style="padding:8px; border:1px solid #e1e4e8;">Winning Variant</th>
                <th style="padding:8px; border:1px solid #e1e4e8;">Confidence Level</th>
                <th style="padding:8px; border:1px solid #e1e4e8;">Promoted At</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong style="color:#0366d6;">EXP-101</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">Variant B (Orange Button)</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:600;">97.4%</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#586069;">Today, 11:30 AM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Toggle button interaction
    const toggleBtn = container.querySelector('#btn-toggle-autopilot');
    let isEnabled = true;

    toggleBtn.addEventListener('click', () => {
      isEnabled = !isEnabled;
      if (isEnabled) {
        toggleBtn.textContent = 'Enabled (Active)';
        toggleBtn.style.background = '#2ea44f';
      } else {
        toggleBtn.textContent = 'Disabled (Paused)';
        toggleBtn.style.background = '#d73a49';
      }
    });
  }
}
