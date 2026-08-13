/**
 * Modular Assembly Controller - Gamification & Rewards (Full Production Version)
 * Path: admin/features/gamification-rewards/gamification-assembly.js
 */

import { gamificationCoreInstance } from './gamification-core.js';
import { DailyStreakModule } from './modules/daily-streak.js';
import { ReferralSpinModule } from './modules/referral-spin.js';
import { UserLeaderboardModule } from './modules/user-leaderboard.js';
import { QuestsTasksModule } from './modules/quests-tasks.js';
import { AchievementsBadgesModule } from './modules/achievements-badges.js';
import { RedeemStoreModule } from './modules/redeem-store.js';
import { StreakProtectionModule } from './modules/streak-protection.js';
import { XPBoostEventsModule } from './modules/xp-boost-events.js';

export class GamificationAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'daily-streak';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="gamification-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Gamification & Rewards</h2>
          <small style="color:#6e7681;">Streaks, Quests, Badges, Leaderboards & Multipliers</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="daily-streak">Daily Streak</button>
          <button class="tab-btn" data-subtab="referral-spin">Referral & Spin</button>
          <button class="tab-btn" data-subtab="user-leaderboard">Leaderboard</button>
          <button class="tab-btn" data-subtab="quests-tasks">Quests & Tasks</button>
          <button class="tab-btn" data-subtab="achievements-badges">Badges</button>
          <button class="tab-btn" data-subtab="redeem-store">Redeem Store</button>
          <button class="tab-btn" data-subtab="streak-protection">Streak Protection</button>
          <button class="tab-btn" data-subtab="xp-boost-events">XP Boost Events</button>
        </nav>

        <main id="gamification-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#gamification-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'daily-streak':
        DailyStreakModule.render(view, gamificationCoreInstance);
        break;
      case 'referral-spin':
        ReferralSpinModule.render(view, gamificationCoreInstance);
        break;
      case 'user-leaderboard':
        UserLeaderboardModule.render(view, gamificationCoreInstance);
        break;
      case 'quests-tasks':
        QuestsTasksModule.render(view, gamificationCoreInstance);
        break;
      case 'achievements-badges':
        AchievementsBadgesModule.render(view, gamificationCoreInstance);
        break;
      case 'redeem-store':
        RedeemStoreModule.render(view, gamificationCoreInstance);
        break;
      case 'streak-protection':
        StreakProtectionModule.render(view, gamificationCoreInstance);
        break;
      case 'xp-boost-events':
        XPBoostEventsModule.render(view, gamificationCoreInstance);
        break;
      default:
        DailyStreakModule.render(view, gamificationCoreInstance);
        break;
    }
  }

  attachEventListeners() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.style.fontWeight = 'normal';
        });
        
        e.target.classList.add('active');
        e.target.style.fontWeight = 'bold';
        
        this.activeSubTab = e.target.dataset.subtab;
        this.renderActiveSubTab();
      });
    });

    // Dynamic event handlers for sub-modules
    this.container.addEventListener('click', (e) => {
      if (e.target.id === 'btn-toggle-boost') {
        gamificationCoreInstance.toggleBoostEvent();
        this.renderActiveSubTab();
      }
    });
  }
}

export const gamificationAssemblyInstance = new GamificationAssembly();
