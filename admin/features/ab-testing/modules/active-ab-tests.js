/**
 * Active A/B Tests Manager Module (Optimized)
 * Path: admin/features/ab-testing/modules/active-ab-tests.js
 */

export class ActiveAbTestsModule {
  static render(container, core) {
    const tests = core.getActiveTests();

    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0 0 4px 0;">⚡ Active A/B Tests Manager</h4>
            <p style="margin:0; font-size:13px; color:#586069;">Monitor active experiments, adjust traffic split ratios, and control test status.</p>
          </div>
          <button id="btn-create-test" style="background:#2ea44f; color:#fff; border:none; padding:8px 12px; border-radius:6px; font-size:13px; cursor:pointer; font-weight:600;">+ New Experiment</button>
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px; min-width: 600px;">
            <thead>
              <tr style="background:#f6f8fa; text-align:left;">
                <th style="padding:10px; border:1px solid #e1e4e8;">ID & Name</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Variant A / B</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Traffic Split</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Status</th>
                <th style="padding:10px; border:1px solid #e1e4e8; text-align:center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tests.length === 0 ? `
                <tr>
                  <td colspan="5" style="padding:20px; text-align:center; color:#6e7681; border:1px solid #e1e4e8;">
                    No active experiments running right now.
                  </td>
                </tr>
              ` : tests.map(t => `
                <tr>
                  <td style="padding:10px; border:1px solid #e1e4e8;">
                    <strong style="color:#0366d6;">${t.id}</strong><br/>
                    <span>${t.name}</span>
                  </td>
                  <td style="padding:10px; border:1px solid #e1e4e8;">${t.variantA} vs${t.variantB}</td>
                  <td style="padding:10px; border:1px solid #e1e4e8;">${t.split}</td>
                  <td style="padding:10px; border:1px solid #e1e4e8;">
                    <span style="background: #e6ffed; color:#28a745; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:bold;">${t.status}</span>
                  </td>
                  <td style="padding:10px; border:1px solid #e1e4e8; text-align:center;">
                    <button class="action-btn" data-id="${t.id}" data-action="pause" style="background:#f1f8ff; border:1px solid #c8e1ff; color:#0366d6; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:12px; margin-right:4px;">Pause</button>
                    <button class="action-btn" data-id="${t.id}" data-action="edit" style="background:#fafbfc; border:1px solid #e1e4e8; color:#24292e; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:12px;">Edit</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Attach event listeners for buttons inside the module
    container.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const testId = e.target.dataset.id;
        const action = e.target.dataset.action;
        alert(`Action '${action}' triggered for experiment ID: ${testId}`);
      });
    });
  }
}
