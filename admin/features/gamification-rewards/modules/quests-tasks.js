/**
 * Sub-Module: Daily & Weekly Quests Engine
 * Path: admin/features/gamification-rewards/modules/quests-tasks.js
 */

export class QuestsTasksModule {
  static render(container, coreInstance) {
    const quests = coreInstance.getQuests();
    container.innerHTML = `
      <div class="quests-panel" style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">Daily & Event Quests</h4>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${quests.map(q => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border:1px solid #e1e4e8; border-radius:6px;">
              <div>
                <strong>${q.title}</strong>
                <p style="margin:4px 0 0; font-size:12px; color:#586069;">${q.description}</p>
              </div>
              <span style="background:#dafbe1; color:#1a7f37; font-weight:bold; padding:4px 8px; border-radius:12px; font-size:12px;">
                +${q.rewardXP} XP
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
