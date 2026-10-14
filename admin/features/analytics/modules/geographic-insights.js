/**
 * Geographic Insights & Regional Heatmap Module (Optimized & Production-Ready)
 * Path: admin/features/analytics/modules/geographic-insights.js
 */

export class GeographicInsightsModule {
  static container = null;
  static core = null;

  static render(container, core) {
    this.container = container;
    this.core = core;
    this.renderUI();
  }

  static renderUI() {
    if (!this.container || !this.core) return;
    const states = this.core.getTopStates();

    this.container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0; color:#24292e;">🗺️ Geographic Insights & Regional Heatmap</h4>
        <p style="font-size:13px; color:#586069;">State-wise traffic and regional language preference distribution.</p>

        <div style="margin-top:15px; display:flex; flex-direction:column; gap:4px;">
          ${states.length ? states.map(s => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:#f6f8fa; border:1px solid #e1e4e8; border-radius:6px; font-size:13px;">
              <span style="color:#24292e;"><strong>📍 ${s.state}</strong></span>
              <span style="color:#0366d6; font-weight:bold; background:#e1f0ff; padding:2px 8px; border-radius:12px; font-size:12px;">${s.count}</span>
            </div>
          `).join('') : '<p style="color:#586069; font-size:13px;">No geographic data available.</p>'}
        </div>
      </div>
    `;
  }

  static destroy() {
    this.container = null;
    this.core = null;
  }
}
