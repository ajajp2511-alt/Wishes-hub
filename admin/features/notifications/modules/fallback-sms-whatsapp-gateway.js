export class FallbackSmsWhatsappGatewayModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📲 Fallback SMS & WhatsApp Backup Alert Gateway</h4>
        <p style="font-size:13px; color:#586069;">Route undelivered high-priority push notifications through fallback SMS/WhatsApp channels.</p>
      </div>
    `;
  }
}
