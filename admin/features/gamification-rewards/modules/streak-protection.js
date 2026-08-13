/**
 * Sub-Module: Streak Freeze & Protection Mechanics
 * Path: admin/features/gamification-rewards/modules/streak-protection.js
 */

export class StreakProtectionModule {
  static render(container, coreInstance) {
    const config = coreInstance.getStreakProtectionConfig();
    container.innerHTML = `
      <div class="streak-protection-panel" style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Streak Freeze & Saver Mechanics</h4>
        <p style="font-size:13px; color:#586069;">Configure safety nets to prevent users from losing long daily streaks.</p>
        
        <div style="display:flex; gap:15px; margin-top:15px;">
          <div style="border:1px solid #d1d5da; padding:15px; border-radius:6px; flex:1; background:#fcf8e3;">
            <strong>Streak Freeze Pass Cost</strong>
            <div style="font-size:18px; font-weight:bold; color:#8a6d3b; margin-top:5px;">${config.freezeCostXP} XP</div>
            <small style="color:#6e7681;">User can hold max ${config.maxHoldLimit} passes at once.</small>
          </div>
          
          <div style="border:1px solid #d1d5da; padding:15px; border-radius:6px; flex:1; background:#d9edf7;">
            <strong>Auto-Saver Notification Trigger</strong>
            <div style="font-size:18px; font-weight:bold; color:#31708f; margin-top:5px;">${config.alertBeforeHours} Hours Before Expiry</div>
            <small style="color:#6e7681;">Automated push alert sent to preserve streak.</small>
          </div>
        </div>
      </div>
    `;
  }
}
