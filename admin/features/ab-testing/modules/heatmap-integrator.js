/**
 * Visual Heatmap Comparison Module (Optimized & Interactive)
 * Path: admin/features/ab-testing/modules/heatmap-integrator.js
 */

export class HeatmapIntegratorModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0; margin-bottom: 4px;">🔥 Visual Heatmap Comparison</h4>
        <p style="font-size:13px; color:#586069; margin-bottom: 20px;">Compare click distributions and scroll depths across test variants.</p>

        <!-- Controls Toolbar -->
        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; align-items: center;">
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #24292e;">Select Variant</label>
            <select id="heatmap-variant" style="padding: 8px; border: 1px solid #e1e4e8; border-radius: 6px; font-size: 13px; background: #fafbfc;">
              <option value="variant-a">Variant A (Green Button)</option>
              <option value="variant-b">Variant B (Orange Button)</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #24292e;">Metrics View</label>
            <select id="heatmap-type" style="padding: 8px; border: 1px solid #e1e4e8; border-radius: 6px; font-size: 13px; background: #fafbfc;">
              <option value="clicks">Click Heatmap</option>
              <option value="scroll">Scroll Depth Map</option>
            </select>
          </div>
          <div style="align-self: flex-end;">
            <button id="btn-load-heatmap" style="background:#0366d6; color:#fff; border:none; padding:9px 16px; border-radius:6px; font-size:13px; cursor:pointer; font-weight:600;">Load Heatmap</button>
          </div>
        </div>

        <!-- Heatmap Display Canvas Area -->
        <div id="heatmap-canvas-view" style="border: 1px solid #e1e4e8; background: #f6f8fa; height: 260px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #6e7681; font-size: 13px; text-align: center; padding: 20px;">
          Select variant and click <strong>Load Heatmap</strong> to render visual user interaction overlays.
        </div>
      </div>
    `;

    // Attach event listener for loading heatmap
    const loadBtn = container.querySelector('#btn-load-heatmap');
    const canvasView = container.querySelector('#heatmap-canvas-view');
    const variantSelect = container.querySelector('#heatmap-variant');

    loadBtn.addEventListener('click', () => {
      const selectedVariant = variantSelect.options[variantSelect.selectedIndex].text;
      
      canvasView.innerHTML = `
        <div style="color: #24292e;">
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 6px; color: #0366d6;">🟢 Heatmap Loaded for ${selectedVariant}</div>
          <p style="font-size: 12px; color: #586069; margin: 0;">Showing high-density click clusters around primary CTA button area.</p>
        </div>
      `;
      canvasView.style.background = 'linear-gradient(135deg, #e6ffed 0%, #fff8c5 100%)';
    });
  }
}
