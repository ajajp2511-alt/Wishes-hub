export class ConversionMetricsModule {
  static render(container, core) {
    const metrics = core.getMetrics();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📊 Conversion Metrics Analytics</h4>
        <p style="font-size:13px; color:#586069;">Compare CTR, conversion rates, and statistical confidence levels.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Test ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Variant A CTR</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Variant B CTR</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Confidence</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Leading Variant</th>
            </tr>
          </thead>
          <tbody>
            ${metrics.map(m => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><strong>${m.testId}</strong></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${m.variantA_CTR}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${m.variantB_CTR}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${m.confidence}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#0088cc; font-weight:bold;">${m.winner}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
