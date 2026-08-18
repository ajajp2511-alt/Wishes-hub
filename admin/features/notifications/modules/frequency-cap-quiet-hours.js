export class FrequencyCapQuietHoursModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🛑 Anti-Spam Rate Limiter & Timezone Quiet Hours</h4>
        <p style="font-size:13px; color:#586069;">Enforce per-user daily limits (max 2/day) and block late-night push deliveries.</p>
      </div>
    `;
  }
}
