/**
 * Sub-Module: Achievements & Unlockable Badges
 * Path: admin/features/gamification-rewards/modules/achievements-badges.js
 */

export class AchievementsBadgesModule {
  static render(container, coreInstance) {
    const badges = coreInstance.getBadges();
    container.innerHTML = `
      <div class="badges-panel" style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Badges & Milestones Configuration</h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">
          ${badges.map(b => `
            <div style="border:1px solid #d1d5da; padding:12px; border-radius:6px; text-align:center; background:#fafbfc;">
              <div style="font-size:24px;">${b.icon}</div>
              <strong style="font-size:14px; display:block; margin-top:5px;">${b.name}</strong>
              <small style="color:#586069; font-size:11px;">${b.criteria}</small>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
