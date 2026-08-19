export class ColdStartMonitorModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">❄️ Cold Start vs Warm Execution Monitor</h4>
        <p style="font-size:13px; color:#586069;">Analyze cold start latency overhead and edge worker instance recycling frequency.</p>
      </div>
    `;
  }
}
