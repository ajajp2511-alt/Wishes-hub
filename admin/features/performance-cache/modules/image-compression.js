export class ImageCompressionModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🖼️ Image Compression & Format Converter</h4>
        <p style="font-size:13px; color:#586069;">Convert uploaded user assets to WebP/AVIF format with dynamic quality control.</p>
      </div>
    `;
  }
}
