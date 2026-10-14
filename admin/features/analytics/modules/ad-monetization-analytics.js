/**
 * Ad Revenue & eCPM Tracker Module (Optimized & Production-Ready)
 * Path: admin/features/analytics/modules/ad-monetization-analytics.js
 */

export class AdMonetizationAnalyticsModule {
  static container = null;
  static core = null;
  static intervalId = null;

  static render(container, core) {
    this.container = container;
    this.core = core;
    this.renderUI();

    // Optional: Live refresh every 5 seconds if core updates
    this.intervalId = setInterval(() => {
      this.updateMetrics();
    }, 5000);
  }

  static renderUI() {
    if (!this.container || !this.core) return;
    const data = this.core.getLiveData();

    this.container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0; color:#24292e;">💰 Ad Revenue & eCPM Tracker</h4>
        <p style="font-size:13px; color:#586069;">AdSense/Header bidding revenue and high-yield category mapping.</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; margin-top: 15px;">
          <div style="background:#f6f8fa; padding:15px; border-radius:6px; border: 1px solid #e1e4e8;">
            <div style="font-size:12px; color:#586069; font-weight:500;">Est. Today Revenue</div>
            <div id="ad-revenue-val" style="font-size:22px; font-weight:bold; color:#28a745; margin-top:5px;">${data.adRevenue}</div>
          </div>
          <div style="background:#f6f8fa; padding:15px; border-radius:6px; border: 1px solid #e1e4e8;">
            <div style="font-size:12px; color:#586069; font-weight:500;">Average eCPM</div>
            <div style="font-size:22px; font-weight:bold; color:#0366d6; margin-top:5px;">$2.85</div>
          </div>
        </div>
      </div>
    `;
  }

  static updateMetrics() {
    if (!this.container || !this.core) return;
    const data = this.core.getLiveData();
    const revenueEl = this.container.querySelector('#ad-revenue-val');
    if (revenueEl) {
      revenueEl.textContent = data.adRevenue;
    }
  }

  static destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.container = null;
    this.core = null;
  }
}
