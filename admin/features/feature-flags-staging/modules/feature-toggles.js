/**
 * Sub-Module: Feature Toggles & Percentage Rollouts
 * Path: admin/features/feature-flags-staging/modules/feature-toggles.js
 */

export class FeatureTogglesModule {
  static render(container, flagsCoreInstance) {
    if (!container) return;

    const flags = flagsCoreInstance?.getAllFlags 
      ? flagsCoreInstance.getAllFlags() 
      : Array.from(flagsCoreInstance?.flags?.values() || []);

    container.innerHTML = `
      <div class="toggles-panel">
        <h3 class="flags-section-title">Runtime Feature Toggles & Rollouts</h3>
        <div class="toggle-cards-list">
          ${flags.length === 0 
            ? `<div class="security-empty">No feature flags registered.</div>`
            : flags.map(flag => `
              <div class="feature-card">
                <div class="card-top-row">
                  <div class="feature-info">
                    <h4>${flag.name || 'Unnamed Flag'}</h4>
                    <span class="feature-key">[${flag.id}]</span>
                    <span class="env-tag ${flag.environment || 'production'}">${flag.environment || 'production'}</span>
                  </div>
                  
                  <div class="toggle-control">
                    <input 
                      type="checkbox" 
                      class="chk-flag" 
                      id="chk-${flag.id}" 
                      data-id="${flag.id}" 
                      ${flag.enabled ? 'checked' : ''} 
                    />
                    <label for="chk-${flag.id}">${flag.enabled ? 'Enabled' : 'Disabled'}</label>
                  </div>
                </div>

                <div class="rollout-row">
                  <span class="rollout-label">Rollout Percentage:</span>
                  <div class="rollout-slider-container">
                    <input 
                      type="range" 
                      class="rng-rollout rollout-slider" 
                      data-id="${flag.id}" 
                      min="0" 
                      max="100" 
                      value="${flag.rolloutPercentage ?? 0}" 
                    />
                    <span id="lbl-${flag.id}" class="rollout-percentage">${flag.rolloutPercentage ?? 0}% Users</span>
                  </div>
                </div>

                <div style="margin-top: 0.5rem; text-align: right;">
                  <button class="btn-kill-test circuit-breaker-btn" data-id="${flag.id}">
                    Simulate Circuit Breaker
                  </button>
                </div>
              </div>
            `).join('')
          }
        </div>
      </div>
    `;
  }
}
