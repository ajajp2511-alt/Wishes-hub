export class ActiveAbTestsModule {
  static render(container, core) {
    const tests = core.getActiveTests();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⚡ Active A/B Tests Manager</h4>
        <p style="font-size:13px; color:#586069;">Monitor active experiments, adjust traffic split ratios, and control test status.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Experiment Name</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Variant A / B</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Traffic Split</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${tests.map(t => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${t.name}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${t.variantA} vs ${t.variantB}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${t.split}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#28a745; font-weight:bold;">${t.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
