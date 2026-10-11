/**
 * Audience & Device Segmentation Module (Optimized & Interactive)
 * Path: admin/features/ab-testing/modules/audience-segmentation.js
 */

export class AudienceSegmentationModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0 0 4px 0;">🎯 Audience & Device Segmentation</h4>
            <p style="margin:0; font-size:13px; color:#586069;">Target A/B tests to specific regions, devices (Mobile vs Desktop), or user types.</p>
          </div>
          <button id="btn-add-segment" style="background:#2ea44f; color:#fff; border:none; padding:8px 12px; border-radius:6px; font-size:13px; cursor:pointer; font-weight:600;">+ Add Segment Rule</button>
        </div>

        <!-- Active Segmentation Rules List -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
          <div style="border: 1px solid #e1e4e8; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; background: #fafbfc;">
            <div>
              <strong style="font-size: 13px; color: #24292e;">Mobile Users - India Region</strong>
              <div style="font-size: 12px; color: #586069; margin-top: 2px;">Device: Mobile | Country: IN | Traffic Allocation: 100%</div>
            </div>
            <span style="background: #e6ffed; color: #28a745; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">Active</span>
          </div>

          <div style="border: 1px solid #e1e4e8; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; background: #fafbfc;">
            <div>
              <strong style="font-size: 13px; color: #24292e;">Desktop Power Users</strong>
              <div style="font-size: 12px; color: #586069; margin-top: 2px;">Device: Desktop | User Type: Returning | Traffic Allocation: 50%</div>
            </div>
            <span style="background: #e6ffed; color: #28a745; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">Active</span>
          </div>
        </div>
      </div>
    `;

    // Attach event listener for adding new segment rule
    const addBtn = container.querySelector('#btn-add-segment');
    addBtn.addEventListener('click', () => {
      alert('Segment Rule Creator modal or form can be integrated here!');
    });
  }
}
