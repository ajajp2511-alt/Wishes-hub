export class WebhookHmacSecurityModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🔒 HMAC SHA-256 Signature Security</h4>
        <p style="font-size:13px; color:#586069;">Generate signing secret keys and verify payload signatures for incoming/outgoing webhooks.</p>
      </div>
    `;
  }
}
