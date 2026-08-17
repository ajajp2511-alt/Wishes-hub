export class UgcShowcaseManagerModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🎨 User Generated Content (UGC) Showcase Manager</h4>
        <p style="font-size:13px; color:#586069;">Approve and feature user-submitted wishes on the public community gallery.</p>
      </div>
    `;
  }
}
