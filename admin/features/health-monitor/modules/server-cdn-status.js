export class ServerCdnStatusModule {
  static render(container, core) {
    const status = core.getServerStatus();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🖥️ Server & CDN Status</h4>
        <p style="font-size:13px; color:#586069;">Monitor Vercel edge functions and regional CDN node availability.</p>

        <div style="display:flex; gap:15px; margin-top:15px;">
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:24px; font-weight:bold; color:#28a745;">${status.uptime}</div>
            <small style="color:#586069;">Uptime SLA</small>
          </div>
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:20px; font-weight:bold;">${status.avgResponseTime}</div>
            <small style="color:#586069;">Avg Edge Latency</small>
          </div>
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:14px; font-weight:bold;">${status.activeRegions.join(', ')}</div>
            <small style="color:#586069;">Active Edge Nodes</small>
          </div>
        </div>
      </div>
    `;
  }
}
