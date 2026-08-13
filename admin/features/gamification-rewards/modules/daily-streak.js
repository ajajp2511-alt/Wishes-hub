/**
 * Sub-Module: Daily Streak & Rewards
 * Path: admin/features/gamification-rewards/modules/daily-streak.js
 */

export class DailyStreakModule {
  static render(container, coreInstance) {
    const config = coreInstance.streakConfig;
    container.innerHTML = `
      <div class="streak-panel" style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Daily Streak Rewards Management</h4>
        <p style="font-size:13px; color:#586069;">Configure bonus points awarded for consecutive app logins.</p>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap:10px; margin-top:15px;">
          ${config.map(item => `
            <div style="border:1px solid #d1d5da; padding:10px; border-radius:6px; text-align:center;">
              <strong>Day ${item.day}</strong>
              <div style="color:#2da44e; font-weight:bold; margin-top:5px;">+${item.points} pts</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
