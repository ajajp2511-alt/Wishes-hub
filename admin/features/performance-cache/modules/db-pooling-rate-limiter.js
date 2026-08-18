export class DbPoolingRateLimiterModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🛡️ DB Connection Pooling & Spike Rate Limits</h4>
        <p style="font-size:13px; color:#586069;">Prevent database crashes during peak festive traffic surges via query throttling.</p>
      </div>
    `;
  }
}
