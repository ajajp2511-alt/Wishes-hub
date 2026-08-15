export class AdMonetizationAnalyticsModule {
  static render(container, core) {
    const data = core.getLiveData();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">💰 Ad Revenue & eCPM Tracker</h4>
        <p style="font-size:13px; color:#586069;">AdSense/Header bidding revenue and high-yield category mapping.</p>
        <div style="margin-top:15px; background:#f6f8fa; padding:12px; border-radius:6px; font-size:13px;">
          Est. Today Revenue: <strong style="color:#28a745;">${data.adRevenue}</strong>
        </div>
      </div>
    `;
  }
}
