/**
 * Sub-Module: User Leaderboard
 * Path: admin/features/gamification-rewards/modules/user-leaderboard.js
 */

export class UserLeaderboardModule {
  static render(container, coreInstance) {
    const leaders = coreInstance.getLeaderboard();
    container.innerHTML = `
      <div class="leaderboard-panel" style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Top User Leaderboard</h4>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${leaders.map((u, index) => `
            <div style="display:flex; justify-space-between; align-items:center; padding:10px; border:1px solid #f0f0f0; border-radius:6px;">
              <div>
                <span style="font-weight:bold; color:#0366d6; margin-right:10px;">#${index + 1}</span>
                <strong>${u.name}</strong> 
                <small style="color:#6e7681; margin-left:8px;">(${u.badge})</small>
              </div>
              <span style="background:#f6f8fa; padding:4px 8px; border-radius:12px; font-weight:bold; color:#2da44e;">
                ${u.points} XP
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
