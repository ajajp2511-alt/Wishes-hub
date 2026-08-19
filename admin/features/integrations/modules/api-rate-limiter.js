export class ApiRateLimiterModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🛑 API Rate Limiter & Usage Quota Manager</h4>
        <p style="font-size:13px; color:#586069;">Set request limits per key, IP throttling rules, and daily quota ceilings.</p>
      </div>
    `;
  }
}
