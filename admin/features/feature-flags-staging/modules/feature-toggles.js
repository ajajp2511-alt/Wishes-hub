/**
 * Sub-Module: Feature Toggles & Percentage Rollouts
 * Path: admin/features/feature-flags-staging/modules/feature-toggles.js
 */

export class FeatureTogglesModule {
  static render(container, flagsCoreInstance) {
    const flags = Array.from(flagsCoreInstance.flags.values());
    container.innerHTML = `
      <div class="toggles-panel">
        <h4 style="margin-bottom:15px;">Runtime Feature Toggles & Rollouts</h4>
        <div style="display:flex; flex-direction:column; gap:15px;">
          ${flags.map(flag => `
            <div style="border:1px solid #e1e4e8; padding:15px; border-radius:8px; background:#fff;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong style="font-size:16px;">${flag.name}</strong> 
                  <code style="margin-left:8px; font-size:12px;">[${flag.id}]</code>
                  <span style="background:#f1f8ff; color:#0366d6; padding:2px 6px; border-radius:4px; font-size:12px; margin-left:8px;">${flag.environment}</span>
                </div>
                <label class="switch">
                  <input type="checkbox" class="chk-flag" data-id="${flag.id}" ${flag.enabled ? 'checked' : ''} />
                  <span>${flag.enabled ? 'Enabled' : 'Disabled'}</span>
                </label>
              </div>

              <div style="margin-top:12px; display:flex; align-items:center; gap:15px;">
                <label style="font-size:13px; font-weight:bold;">Rollout Percentage:</label>
                <input type="range" class="rng-rollout" data-id="${flag.id}" min="0" max="100" value="${flag.rolloutPercentage}" style="width:180px;" />
                <span id="lbl-${flag.id}">${flag.rolloutPercentage}% Users</span>
                <button class="btn-kill-test" data-id="${flag.id}" style="margin-left:auto; font-size:12px; background:#fff0f0; color:#d73a49; border:1px solid #ffdce0; padding:4px 8px; border-radius:4px; cursor:pointer;">Simulate Circuit Breaker</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
