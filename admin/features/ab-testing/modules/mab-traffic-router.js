/**
 * Multi-Armed Bandit Traffic Optimizer Module (Optimized & Interactive)
 * Path: admin/features/ab-testing/modules/mab-traffic-router.js
 */

export class MabTrafficRouterModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0 0 4px 0;">🤖 Multi-Armed Bandit Traffic Optimizer</h4>
            <p style="margin:0; font-size:13px; color:#586069;">Dynamically allocate more traffic to higher-performing variants in real time.</p>
          </div>
          <span style="background:#e6ffed; color:#28a745; padding:4px 10px; border-radius:12px; font-size:12px; font-weight:bold;">Algorithm: Thompson Sampling</span>
        </div>

        <!-- Dynamic Traffic Weight Bars -->
        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 14px;">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 4px;">
              <span>Variant A (Green Button - Control)</span>
              <span style="color: #586069;">24.5% Traffic</span>
            </div>
            <div style="background: #e1e4e8; border-radius: 4px; height: 10px; overflow: hidden;">
              <div style="background: #0366d6; width: 24.5%; height: 100%; border-radius: 4px;"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 4px;">
              <span style="color: #28a745;">Variant B (Orange Button - Winner)</span>
              <span style="color: #28a745;">75.5% Traffic (Auto-Optimized)</span>
            </div>
            <div style="background: #e1e4e8; border-radius: 4px; height: 10px; overflow: hidden;">
              <div style="background: #28a745; width: 75.5%; height: 100%; border-radius: 4px;"></div>
            </div>
          </div>
        </div>

        <div style="margin-top: 20px; padding: 12px; background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; font-size: 13px; color: #586069;">
          💡 <strong>MAB Note:</strong> Traffic weights update dynamically every 15 minutes based on live conversion reward feedback.
        </div>
      </div>
    `;
  }
}
