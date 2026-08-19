export class ThirdPartyServicesModule {
  static render(container, core) {
    const services = core.getThirdPartyServices();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🌐 Third-Party External Services Vault</h4>
        <p style="font-size:13px; color:#586069;">Connected API provider connections and credential health.</p>

        <div style="display:flex; gap:15px; margin-top:15px;">
          ${services.map(s => `
            <div style="border:1px solid #e1e4e8; padding:15px; border-radius:6px; flex:1;">
              <h5 style="margin:0 0 5px 0;">${s.provider}</h5>
              <div style="font-size:12px; color:#28a745; font-weight:bold;">● ${s.status}</div>
              <small style="color:#586069;">Latency: ${s.ping}</small>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
