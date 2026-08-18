export class PageSpeedInsightsModule {
  static render(container, core) {
    const metrics = core.getPageMetrics();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📊 Core Web Vitals & PageSpeed Score</h4>
        <p style="font-size:13px; color:#586069;">Real-time performance audit metrics for desktop and mobile clients.</p>

        <div style="display:flex; gap:15px; margin-top:15px;">
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:24px; font-weight:bold; color:#28a745;">${metrics.overallScore} / 100</div>
            <small style="color:#586069;">Overall Score</small>
          </div>
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:20px; font-weight:bold;">${metrics.lcp}</div>
            <small style="color:#586069;">LCP (Largest Contentful Paint)</small>
          </div>
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:20px; font-weight:bold;">${metrics.cls}</div>
            <small style="color:#586069;">CLS (Cumulative Layout Shift)</small>
          </div>
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:20px; font-weight:bold;">${metrics.inp}</div>
            <small style="color:#586069;">INP (Interaction to Next Paint)</small>
          </div>
        </div>
      </div>
    `;
  }
}
