export class GeographicInsightsModule {
  static render(container, core) {
    const states = core.getTopStates();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🗺️ Geographic Insights & Regional Heatmap</h4>
        <p style="font-size:13px; color:#586069;">State-wise traffic and regional language preference distribution.</p>

        <div style="margin-top:15px;">
          ${states.map(s => `
            <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #e1e4e8; font-size:13px;">
              <span><strong>${s.state}</strong></span>
              <span style="color:#0088cc; font-weight:bold;">${s.count}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
