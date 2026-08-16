export class RevenueDashboardModule {
  static render(container, core) {
    const rev = core.getRevenueSummary();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">💰 Unified Revenue & eCPM Dashboard</h4>
        <p style="font-size:13px; color:#586069;">Aggregated earnings across ad networks and direct sponsorships.</p>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-top:15px;">
          <div style="background:#f6f8fa; padding:15px; border-radius:6px;">
            <div style="font-size:12px; color:#586069;">Today's Revenue</div>
            <div style="font-size:20px; font-weight:bold; color:#28a745;">${rev.todayEarnings}</div>
          </div>
          <div style="background:#f6f8fa; padding:15px; border-radius:6px;">
            <div style="font-size:12px; color:#586069;">Average eCPM</div>
            <div style="font-size:20px; font-weight:bold; color:#0088cc;">${rev.avgECPM}</div>
          </div>
          <div style="background:#f6f8fa; padding:15px; border-radius:6px;">
            <div style="font-size:12px; color:#586069;">Impressions</div>
            <div style="font-size:20px; font-weight:bold; color:#333;">${rev.totalImpressions}</div>
          </div>
        </div>
      </div>
    `;
  }
}
