export class SocialOgPreviewModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🖼️ Social OG & Live Card Preview</h4>
        <p style="font-size:13px; color:#586069;">Preview OpenGraph preview images for WhatsApp, Twitter/X, and Facebook.</p>
      </div>
    `;
  }
}
