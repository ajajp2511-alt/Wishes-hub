export class ThirdPartyApiTrackerModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🌐 Third-Party Dependency Tracker</h4>
        <p style="font-size:13px; color:#586069;">Live availability and response times for Razorpay, Cloudflare, Telegram & Firebase APIs.</p>
      </div>
    `;
  }
}
