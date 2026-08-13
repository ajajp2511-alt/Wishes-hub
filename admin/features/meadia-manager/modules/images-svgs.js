export class ImagesSvgsModule {
  static render(container, core) {
    const images = core.getMediaItems('image');
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Images & SVGs Gallery</h4>
        <p style="font-size:13px; color:#586069;">Manage backgrounds, cutouts, vectors with AI auto-tagging.</p>
        
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:12px; margin-top:15px;">
          ${images.map(img => `
            <div style="border:1px solid #e1e4e8; border-radius:6px; padding:10px; background:#fafbfc; text-align:center;">
              <div style="height:80px; background:#e1e4e8; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:12px; color:#586069;">
                🖼️ Image Preview
              </div>
              <strong style="display:block; font-size:12px; margin-top:8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${img.name}</strong>
              <small style="color:#0088cc; font-size:11px;">Host: ${img.provider}</small>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
