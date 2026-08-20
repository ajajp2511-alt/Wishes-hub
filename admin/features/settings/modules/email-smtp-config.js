export class EmailSmtpConfigModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📧 Outgoing SMTP Email Server Setup</h4>
        <p style="font-size:13px; color:#586069;">Configure AWS SES, SendGrid, or custom SMTP servers for password resets and system notifications.</p>
      </div>
    `;
  }
}
