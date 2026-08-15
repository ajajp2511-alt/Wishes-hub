export class LiveTrafficModule {
  static render(container, core) {
    const data = core.getLiveData();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⚡ Live Traffic Monitoring</h4>
        <p style="font-size:13px; color:#586069;">Real-time active visitors and session breakdown.</p>
        
        <div style="margin-top:15px; background:#f0f8ff; padding:15px; border-radius:6px; border:1px solid #b6e3ff;">
          <strong style="font-size:24px; color:#0088cc;">${data.activeUsers}</strong>
          <span style="font-size:13px; color:#586069; display:block;">Active Users Right Now</span>
        </div>
      </div>
    `;
  }
}
