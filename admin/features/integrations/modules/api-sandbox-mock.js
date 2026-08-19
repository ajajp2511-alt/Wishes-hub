export class ApiSandboxMockModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🧪 API Sandbox & Webhook Simulator</h4>
        <p style="font-size:13px; color:#586069;">Test integrations with mock event payloads, simulated failures, and sandbox keys.</p>
      </div>
    `;
  }
}
