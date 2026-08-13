export class BulkTemplateRenderModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Bulk Personalization & Dynamic Widgets</h4>
        <p style="font-size:13px; color:#586069;">Batch card generation, scannable QR widgets, and live countdown overlays.</p>
      </div>
    `;
  }
}
