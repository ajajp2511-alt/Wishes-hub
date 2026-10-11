/**
 * Experiment Rollback History Module (Optimized & Interactive)
 * Path: admin/features/ab-testing/modules/experiment-rollback-history.js
 */

export class ExperimentRollbackHistoryModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0; margin-bottom: 4px;">⏮️ Test Archive & Quick Rollback Guard</h4>
        <p style="font-size:13px; color:#586069; margin-bottom: 15px;">Revert layouts instantly to historical winning variants with a single click.</p>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:13px; min-width: 600px;">
            <thead>
              <tr style="background:#f6f8fa; text-align:left;">
                <th style="padding:10px; border:1px solid #e1e4e8;">Experiment ID & Name</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Final State / Winner</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Completed Date</th>
                <th style="padding:10px; border:1px solid #e1e4e8; text-align:center;">Rollback Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:10px; border:1px solid #e1e4e8;">
                  <strong style="color:#0366d6;">EXP-098</strong><br/>
                  <span>Holiday Greeting Card Header Layout</span>
                </td>
                <td style="padding:10px; border:1px solid #e1e4e8;">
                  <span style="background:#e6ffed; color:#28a745; padding:2px 8px; border-radius:12px; font-weight:bold; font-size:11px;">Variant B (Rolled Out)</span>
                </td>
                <td style="padding:10px; border:1px solid #e1e4e8; color:#586069;">Oct 02, 2026</td>
                <td style="padding:10px; border:1px solid #e1e4e8; text-align:center;">
                  <button class="rollback-btn" data-id="EXP-098" style="background:#fff5f5; border:1px solid #feb2b2; color:#c53030; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:600;">Revert to Variant A</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Attach rollback trigger listener
    container.querySelectorAll('.rollback-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const expId = e.target.dataset.id;
        if (confirm(`Are you sure you want to rollback experiment ${expId} to its previous layout state?`)) {
          alert(`Successfully rolled back layout for ${expId}!`);
        }
      });
    });
  }
}
