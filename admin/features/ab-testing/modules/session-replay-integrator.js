/**
 * Variant Session Replay Comparison Module (Optimized & Interactive)
 * Path: admin/features/ab-testing/modules/session-replay-integrator.js
 */

export class SessionReplayIntegratorModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0 0 4px 0;">🎥 Variant Session Replay Comparison</h4>
            <p style="margin:0; font-size:13px; color:#586069;">Compare user interaction recordings across Variant A and Variant B.</p>
          </div>
          <span style="background:#e6ffed; color:#28a745; padding:4px 10px; border-radius:12px; font-size:12px; font-weight:bold;">Replay SDK: Active</span>
        </div>

        <!-- Session Replay List Table -->
        <div style="overflow-x:auto; margin-top: 15px;">
          <table style="width:100%; border-collapse:collapse; font-size:13px; min-width: 600px;">
            <thead>
              <tr style="background:#f6f8fa; text-align:left;">
                <th style="padding:10px; border:1px solid #e1e4e8;">Session ID</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Assigned Variant</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Duration & Actions</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Converted?</th>
                <th style="padding:10px; border:1px solid #e1e4e8; text-align:center;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:10px; border:1px solid #e1e4e8;"><strong style="color:#0366d6;">#REC-8842</strong></td>
                <td style="padding:10px; border:1px solid #e1e4e8;">Variant B (Orange Button)</td>
                <td style="padding:10px; border:1px solid #e1e4e8; color:#586069;">42s (14 clicks, 2 scrolls)</td>
                <td style="padding:10px; border:1px solid #e1e4e8;">
                  <span style="background:#e6ffed; color:#28a745; padding:2px 8px; border-radius:12px; font-weight:bold; font-size:11px;">Yes (Converted)</span>
                </td>
                <td style="padding:10px; border:1px solid #e1e4e8; text-align:center;">
                  <button class="watch-replay-btn" data-session="REC-8842" style="background:#f1f8ff; border:1px solid #c8e1ff; color:#0366d6; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:600;">▶ Watch Replay</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Attach event listener for watching replay
    container.querySelectorAll('.watch-replay-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sessionId = e.target.dataset.session;
        alert(`Opening session replay player modal for session ${sessionId}...`);
      });
    });
  }
}
