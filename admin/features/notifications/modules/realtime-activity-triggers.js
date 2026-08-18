export class RealtimeActivityTriggersModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">⚡ Live Activity & Card Open Alerts</h4>
        <p style="font-size:13px; color:#586069;">Send instant push alerts to senders when their wish card is opened by a receiver.</p>
      </div>
    `;
  }
}
