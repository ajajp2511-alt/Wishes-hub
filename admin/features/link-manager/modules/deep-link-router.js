export class DeepLinkRouterModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📲 Deep Link App Direct Router</h4>
        <p style="font-size:13px; color:#586069;">Route mobile users directly into WhatsApp, Telegram, or native apps without browser prompts.</p>
      </div>
    `;
  }
}
