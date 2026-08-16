export class MabTrafficRouterModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🤖 Multi-Armed Bandit Traffic Optimizer</h4>
        <p style="font-size:13px; color:#586069;">Dynamically allocate more traffic to higher-performing variants in real time.</p>
      </div>
    `;
  }
}
