export class NotificationAnalyticsHeatmapModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📊 Notification CTR & Peak Engagement Heatmap</h4>
        <p style="font-size:13px; color:#586069;">Analyze click-through rates, opt-outs, and identify optimal push broadcast hours.</p>
      </div>
    `;
  }
}
