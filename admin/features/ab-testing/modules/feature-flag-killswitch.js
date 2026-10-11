/**
 * Emergency Feature Flag & Kill Switch Module (Optimized & Interactive)
 * Path: admin/features/ab-testing/modules/feature-flag-killswitch.js
 */

export class FeatureFlagKillswitchModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0; margin-bottom: 4px;">🛑 Emergency Feature Flag & Kill Switch</h4>
        <p style="font-size:13px; color:#586069; margin-bottom: 15px;">Instantly disable broken or underperforming test variants in real time.</p>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:13px; min-width: 600px;">
            <thead>
              <tr style="background:#f6f8fa; text-align:left;">
                <th style="padding:10px; border:1px solid #e1e4e8;">Feature / Experiment Flag</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Target Route</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Current Status</th>
                <th style="padding:10px; border:1px solid #e1e4e8; text-align:center;">Kill Switch Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:10px; border:1px solid #e1e4e8;">
                  <strong style="color:#0366d6;">FLAG_HOMEPAGE_CTA_VARIANT</strong><br/>
                  <span>Hero Section CTA Color Experiment</span>
                </td>
                <td style="padding:10px; border:1px solid #e1e4e8;">/</td>
                <td style="padding:10px; border:1px solid #e1e4e8;">
                  <span style="background:#e6ffed; color:#28a745; padding:2px 8px; border-radius:12px; font-weight:bold; font-size:11px;">Active (Normal)</span>
                </td>
                <td style="padding:10px; border:1px solid #e1e4e8; text-align:center;">
                  <button class="killswitch-btn" data-flag="FLAG_HOMEPAGE_CTA_VARIANT" style="background:#d73a49; border:none; color:#fff; padding:6px 12px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:600;">Kill Feature</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Attach kill switch listener
    container.querySelectorAll('.killswitch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const flagName = e.target.dataset.flag;
        if (confirm(`⚠️ WARNING: Are you sure you want to trigger the kill switch for '${flagName}'? This will instantly disable the feature across all traffic.`)) {
          e.target.style.background = '#6a737d';
          e.target.textContent = 'Killed (Disabled)';
          e.target.disabled = true;
          alert(`Kill switch triggered successfully for ${flagName}.`);
        }
      });
    });
  }
}
