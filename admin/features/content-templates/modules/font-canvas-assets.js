export class FontCanvasAssetsModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Font & Canvas Assets (Typography Studio)</h4>
        <p style="font-size:13px; color:#586069;">Multi-lingual fonts, Devanagari calligraphy, and text glow effects.</p>
        <div style="display:flex; gap:10px; margin-top:15px;">
          <span style="padding:8px 12px; background:#f6f8fa; border:1px solid #e1e4e8; border-radius:6px; font-family:serif;">Rozha One</span>
          <span style="padding:8px 12px; background:#f6f8fa; border:1px solid #e1e4e8; border-radius:6px; font-weight:bold;">Teko Bold</span>
          <span style="padding:8px 12px; background:#f6f8fa; border:1px solid #e1e4e8; border-radius:6px;">Yatra One (देवनागरी)</span>
        </div>
      </div>
    `;
  }
}
