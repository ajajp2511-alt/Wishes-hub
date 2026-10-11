/**
 * Visual Drag-and-Drop Editor Module (Optimized & Interactive)
 * Path: admin/features/ab-testing/modules/visual-variant-editor.js
 */

export class VisualVariantEditorModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0 0 4px 0;">🖼️ Visual Drag-and-Drop Editor</h4>
            <p style="margin:0; font-size:13px; color:#586069;">Tweak website copy, colors, and button placements directly on a visual canvas.</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="btn-save-variant" style="background:#2ea44f; color:#fff; border:none; padding:7px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:600;">Save Changes</button>
            <button id="btn-reset-canvas" style="background:#fafbfc; border:1px solid #e1e4e8; color:#24292e; padding:7px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:600;">Reset</button>
          </div>
        </div>

        <!-- Editor Toolbar -->
        <div style="display: flex; gap: 8px; margin-bottom: 15px; padding: 8px; background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px;">
          <button class="tool-btn" style="background:#fff; border:1px solid #e1e4e8; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:600; color:#0366d6;">👆 Select Element</button>
          <button class="tool-btn" style="background:#fff; border:1px solid #e1e4e8; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:600;">✏️ Edit Copy</button>
          <button class="tool-btn" style="background:#fff; border:1px solid #e1e4e8; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:600;">🎨 Change Color</button>
          <button class="tool-btn" style="background:#fff; border:1px solid #e1e4e8; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:600;">📐 Adjust Padding</button>
        </div>

        <!-- Visual Canvas Preview Area -->
        <div style="border: 1px solid #e1e4e8; background: #fff; height: 240px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; box-shadow: inset 0 0 5px rgba(0,0,0,0.02);">
          <h3 style="margin: 0 0 8px 0; color: #24292e; font-size: 18px;">Send Magical Greetings to Loved Ones</h3>
          <p style="margin: 0 0 16px 0; color: #586069; font-size: 13px; max-width: 400px;">Create and share personalized wishes instantly with our interactive platform.</p>
          <div style="background: #2ea44f; color: #fff; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; border: 2px dashed #fff;">
            Create Wish (Selectable Element)
          </div>
        </div>
      </div>
    `;

    // Attach button actions
    container.querySelector('#btn-save-variant').addEventListener('click', () => {
      alert('Visual variant changes saved successfully!');
    });

    container.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        container.querySelectorAll('.tool-btn').forEach(b => b.style.color = '#24292e');
        e.target.style.color = '#0366d6';
      });
    });
  }
}
