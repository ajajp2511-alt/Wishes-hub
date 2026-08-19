export class EdgeWorkerStatusModule {
  static render(container, core) {
    const status = core.getWorkerStatus();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⚡ Edge Worker Health Status</h4>
        <p style="font-size:13px; color:#586069;">Monitor deployed Cloudflare Workers and Vercel Edge instance availability.</p>

        <div style="display:flex; gap:15px; margin-top:15px;">
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:24px; font-weight:bold; color:#28a745;">${status.globalStatus}</div>
            <small style="color:#586069;">Global Edge Health</small>
          </div>
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:20px; font-weight:bold;">${status.activeWorkers}</div>
            <small style="color:#586069;">Active Deployed Workers</small>
          </div>
          <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1; text-align:center;">
            <div style="font-size:20px; font-weight:bold; color:#d73a49;">${status.failingInstances}</div>
            <small style="color:#586069;">Failing Workers</small>
          </div>
        </div>
      </div>
    `;
  }
}
