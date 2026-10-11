/**
 * Layout & UI Variant Builder Module (Optimized & Interactive)
 * Path: admin/features/ab-testing/modules/layout-variants.js
 */

export class LayoutVariantsModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0 0 4px 0;">🎨 Layout & UI Variant Builder</h4>
            <p style="margin:0; font-size:13px; color:#586069;">Create visual UI variants, CTA texts, and color schemes for experimentation.</p>
          </div>
          <button id="btn-create-variant" style="background:#2ea44f; color:#fff; border:none; padding:8px 12px; border-radius:6px; font-size:13px; cursor:pointer; font-weight:600;">+ New Variant</button>
        </div>

        <!-- Variants List -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
          <div style="border: 1px solid #e1e4e8; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; background: #fafbfc;">
            <div>
              <strong style="font-size: 13px; color: #24292e;">Variant A (Control - Green Button)</strong>
              <div style="font-size: 12px; color: #586069; margin-top: 2px;">Background: #2ea44f | Text: "Create Wish" | Layout: Standard Grid</div>
            </div>
            <span style="background: #e1e4e8; color: #24292e; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">Control</span>
          </div>

          <div style="border: 1px solid #e1e4e8; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; background: #fafbfc;">
            <div>
              <strong style="font-size: 13px; color: #24292e;">Variant B (Challenger - Orange Button)</strong>
              <div style="font-size: 12px; color: #586069; margin-top: 2px;">Background: #f66a0a | Text: "Start Designing Free" | Layout: Stacked Grid</div>
            </div>
            <span style="background: #e6ffed; color: #28a745; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">Active Variant</span>
          </div>
        </div>
      </div>
    `;

    // Attach event listener for creating variant
    const createBtn = container.querySelector('#btn-create-variant');
    createBtn.addEventListener('click', () => {
      alert('Variant creator modal / builder interface can be integrated here!');
    });
  }
}
