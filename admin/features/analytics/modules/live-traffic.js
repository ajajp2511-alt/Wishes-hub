/**
 * Live Traffic Monitoring Module (Optimized & Production-Ready)
 * Path: admin/features/analytics/modules/live-traffic.js
 */

export class LiveTrafficModule {
  static container = null;
  static core = null;
  static intervalId = null;

  static render(container, core) {
    this.container = container;
    this.core = core;
    this.renderUI();

    // Poll for live traffic updates every 5 seconds
    this.intervalId = setInterval(() => {
      this.updateMetrics();
    }, 5000);
  }

  static renderUI() {
    if (!this.container || !this.core) return;
    const data = this.core.getLiveData();

    this.container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0; color:#24292e;">⚡ Live Traffic Monitoring</h4>
        <p style="font-size:13px; color:#586069;">Real-time active visitors and session breakdown.</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; margin-top: 15px;">
          <div style="background:#f0f8ff; padding:15px; border-radius:6px; border:1px solid #b6e3ff;">
            <strong id="live-active-users" style="font-size:26px; color:#0366d6;">${data.activeUsers}</strong>
            <span style="font-size:13px; color:#586069; display:block; margin-top:4px;">Active Users Right Now</span>
          </div>
          <div style="background:#f6f8fa; padding:15px; border-radius:6px; border:1px solid #e1e4e8;">
            <strong style="font-size:26px; color:#24292e;">${data.todayWishes.toLocaleString()}</strong>
            <span style="font-size:13px; color:#586069; display:block; margin-top:4px;">Total Wishes Today</span>
          </div>
        </div>
      </div>
    `;
  }

  static updateMetrics() {
    if (!this.container || !this.core) return;
    const updatedData = this.core.refreshLiveMetrics();
    
    const activeUsersEl = this.container.querySelector('#live-active-users');
    if (activeUsersEl) {
      activeUsersEl.textContent = updatedData.activeUsers;
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
