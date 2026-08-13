/**
 * Sub-Module: Live XP Boost & Happy Hour Events
 * Path: admin/features/gamification-rewards/modules/xp-boost-events.js
 */

export class XPBoostEventsModule {
  static render(container, coreInstance) {
    const boostState = coreInstance.getBoostEventState();
    container.innerHTML = `
      <div class="boost-events-panel" style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Happy Hour & Double XP Multiplier</h4>
        <div style="display:flex; justify-content:space-between; align-items:center; border:1px solid #e1e4e8; padding:15px; border-radius:6px; background:#fafbfc;">
          <div>
            <strong>Current Active Multiplier: <span style="color:#2da44e;">${boostState.multiplier}x XP</span></strong>
            <p style="margin:4px 0 0; font-size:12px; color:#586069;">Event: ${boostState.eventName}</p>
          </div>
          <button id="btn-toggle-boost" style="padding:8px 16px; background:${boostState.isActive ? '#d73a49' : '#2da44e'}; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">
            ${boostState.isActive ? 'Deactivate Boost' : 'Trigger 2x Happy Hour'}
          </button>
        </div>
      </div>
    `;
  }
}
