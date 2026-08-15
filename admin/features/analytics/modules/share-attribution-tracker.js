export class ShareAttributionTrackerModule {
  static render(container, core) {
    const data = core.getLiveData();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📲 Share Attribution & Channel Breakdown</h4>
        <p style="font-size:13px; color:#586069;">WhatsApp vs Telegram vs Direct Link share performance.</p>
        <div style="margin-top:15px; font-size:13px;">
          • WhatsApp Direct Shares: <strong>${data.whatsappShares}</strong>
        </div>
      </div>
    `;
  }
}
