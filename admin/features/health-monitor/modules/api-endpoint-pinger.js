export class ApiEndpointPingerModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">💓 API Endpoint Health Check Ping</h4>
        <p style="font-size:13px; color:#586069;">Automated 60-second synthetic heartbeats and health pings across critical APIs.</p>
      </div>
    `;
  }
}
