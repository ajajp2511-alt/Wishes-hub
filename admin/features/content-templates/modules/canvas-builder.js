export class CanvasBuilderModule {
  static render(container, core) {
    const canvas = core.getActiveCanvas();
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Canvas Layout Builder & Layers Manager</h4>
        <p style="font-size:13px; color:#586069;">Drag-and-drop studio with aspect ratio switcher and dynamic guides.</p>
        
        <div style="margin:15px 0; display:flex; gap:10px;">
          <button class="btn-ratio" data-ratio="9:16" style="padding:6px 12px; cursor:pointer;">9:16 (Story)</button>
          <button class="btn-ratio" data-ratio="1:1" style="padding:6px 12px; cursor:pointer;">1:1 (Square)</button>
          <button class="btn-ratio" data-ratio="16:9" style="padding:6px 12px; cursor:pointer;">16:9 (Banner)</button>
        </div>

        <div style="border:1px solid #d1d5da; padding:12px; border-radius:6px; background:#fafbfc;">
          <strong>Active Canvas Size:</strong> ${canvas.width} x ${canvas.height}px
          <div style="margin-top:10px;">
            <strong>Active Layers (${canvas.layers.length}):</strong>
            <ul style="margin:5px 0 0; padding-left:20px; font-size:13px;">
              ${canvas.layers.map(l => `<li><code>${l.type}</code> - ${l.content || l.src}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }
}
