export class ShareAnalyticsViralityModule {
  static render(container, core) {
    const stats = core.getViralityStats();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📈 Share Analytics & Virality (K-Factor) Tracker</h4>
        <p style="font-size:13px; color:#586069;">Track viral coefficient, share conversion rates, and top growth channels.</p>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-top:15px;">
          <div style="background:#f6f8fa; padding:15px; border-radius:6px;">
            <div style="font-size:12px; color:#586069;">Viral K-Factor</div>
            <div style="font-size:20px; font-weight:bold; color:#28a745;">${stats.kFactor}</div>
          </div>
          <div style="background:#f6f8fa; padding:15px; border-radius:6px;">
            <div style="font-size:12px; color:#586069;">Total Viral Shares</div>
            <div style="font-size:20px; font-weight:bold; color:#0088cc;">${stats.totalViralShares}</div>
          </div>
          <div style="background:#f6f8fa; padding:15px; border-radius:6px;">
            <div style="font-size:12px; color:#586069;">Conversion Rate</div>
            <div style="font-size:20px; font-weight:bold; color:#333;">${stats.conversionRate}</div>
          </div>
        </div>
      </div>
    `;
  }
}
