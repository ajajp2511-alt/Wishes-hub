/**
 * Conversion Metrics Analytics Module (Optimized)
 * Path: admin/features/ab-testing/modules/conversion-metrics.js
 */

export class ConversionMetricsModule {
  static render(container, core) {
    const metrics = core.getMetrics();

    const formatPercent = (val) => {
      if (typeof val === 'number') {
        return val <= 1 && val > 0 ? `${(val * 100).toFixed(1)}%` : `${val.toFixed(1)}%`;
      }
      return val || '0%';
    };

    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0 0 4px 0;">📊 Conversion Metrics Analytics</h4>
            <p style="margin:0; font-size:13px; color:#586069;">Compare CTR, conversion rates, and statistical confidence levels.</p>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px; min-width: 600px;">
            <thead>
              <tr style="background:#f6f8fa; text-align:left;">
                <th style="padding:10px; border:1px solid #e1e4e8;">Test ID</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Variant A CTR</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Variant B CTR</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Confidence</th>
                <th style="padding:10px; border:1px solid #e1e4e8;">Leading / Winner</th>
              </tr>
            </thead>
            <tbody>
              ${metrics.length === 0 ? `
                <tr>
                  <td colspan="5" style="padding:20px; text-align:center; color:#6e7681; border:1px solid #e1e4e8;">
                    No conversion metrics recorded yet.
                  </td>
                </tr>
              ` : metrics.map(m => {
                const confVal = typeof m.confidence === 'number' ? m.confidence : parseFloat(m.confidence) / 100;
                const isWinnerDecided = confVal >= 0.95;

                return `
                  <tr>
                    <td style="padding:10px; border:1px solid #e1e4e8;"><strong style="color:#0366d6;">${m.testId}</strong></td>
                    <td style="padding:10px; border:1px solid #e1e4e8;">${formatPercent(m.variantA_CTR)}</td>
                    <td style="padding:10px; border:1px solid #e1e4e8;">${formatPercent(m.variantB_CTR)}</td>
                    <td style="padding:10px; border:1px solid #e1e4e8;">
                      <span style="background:${isWinnerDecided ? '#e6ffed' : '#fff8c5'}; color:${isWinnerDecided ? '#28a745' : '#b08800'}; padding:3px 8px; border-radius:12px; font-weight:bold; font-size:11px;">
                        ${formatPercent(m.confidence)}
                      </span>
                    </td>
                    <td style="padding:10px; border:1px solid #e1e4e8; color:#0366d6; font-weight:bold;">${m.winner}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}
