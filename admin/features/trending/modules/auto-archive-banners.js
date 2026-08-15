export class AutoArchiveBannersModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">📦 Auto-Archive Expired Banners</h4>
        <p style="font-size:13px; color:#586069;">Automatically unpin and archive banners when festive countdowns conclude.</p>
      </div>
    `;
  }
}
