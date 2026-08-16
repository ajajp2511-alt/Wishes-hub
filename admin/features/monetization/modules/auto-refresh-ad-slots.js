export class AutoRefreshAdSlotsModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔄 Viewport-Active Auto-Refresh Slots</h4>
        <p style="font-size:13px; color:#586069;">Auto-refresh visible ad units on active tabs every 45 seconds.</p>
      </div>
    `;
  }
}
