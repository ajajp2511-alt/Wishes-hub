export class QrCodeGeneratorModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📱 Branded QR Code Generator</h4>
        <p style="font-size:13px; color:#586069;">Create custom vector QR codes with embedded branding logos for offline sharing.</p>
      </div>
    `;
  }
}
