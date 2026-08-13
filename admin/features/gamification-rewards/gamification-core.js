/**
 * Gamification & Rewards Core Engine (Full Production Version)
 * Path: admin/features/gamification-rewards/gamification-core.js
 */

import { GAMIFICATION_CONFIG } from './gamification-config.js';

export class GamificationCore {
  constructor() {
    this.streakConfig = GAMIFICATION_CONFIG.streakConfig;
    this.referralPoints = GAMIFICATION_CONFIG.referralPoints;
    this.spinWheelSlices = GAMIFICATION_CONFIG.spinWheelSlices;
    
    // Core Dynamic States
    this.boostState = {
      isActive: true,
      multiplier: 2,
      eventName: 'Weekend Festival Double XP Boost'
    };

    this.streakProtectionConfig = {
      freezeCostXP: 300,
      maxHoldLimit: 2,
      alertBeforeHours: 3
    };
  }

  /**
   * User Leaderboard Data
   */
  getLeaderboard() {
    return [
      { id: 'usr_1', name: 'Aarav Sharma', points: 2450, badge: 'Gold Creator' },
      { id: 'usr_2', name: 'Priya Patel', points: 1980, badge: 'Silver Creator' },
      { id: 'usr_3', name: 'Rohan Mehta', points: 1420, badge: 'Bronze Creator' }
    ];
  }

  /**
   * Daily Quests & Tasks
   */
  getQuests() {
    return [
      { id: 'q1', title: 'Share 2 Wish Cards', description: 'Create and share 2 wishes on WhatsApp', rewardXP: 50, completed: false },
      { id: 'q2', title: 'Invite a Friend', description: 'Refer 1 new active user using your link', rewardXP: 150, completed: true }
    ];
  }

  /**
   * Achievements & Badges
   */
  getBadges() {
    return [
      { id: 'b1', name: 'First Wish', criteria: 'Created 1st Greeting Card', icon: '🎨', unlocked: true },
      { id: 'b2', name: 'Viral Creator', criteria: 'Card viewed 1,000+ times', icon: '🚀', unlocked: true },
      { id: 'b3', name: 'Streak Master', criteria: 'Maintained a 30-day streak', icon: '🔥', unlocked: false }
    ];
  }

  /**
   * Points Redemption Store
   */
  getStoreItems() {
    return [
      { id: 's1', title: 'No-Watermark Card Pass', costXP: 500, stock: 120 },
      { id: 's2', title: 'Custom Subdomain Unlock', costXP: 1500, stock: 35 }
    ];
  }

  /**
   * Streak Saver / Protection Configuration
   */
  getStreakProtectionConfig() {
    return this.streakProtectionConfig;
  }

  /**
   * Happy Hour & Multiplier Event State
   */
  getBoostEventState() {
    return this.boostState;
  }

  /**
   * Toggle Happy Hour Double XP Event
   */
  toggleBoostEvent() {
    this.boostState.isActive = !this.boostState.isActive;
    return this.boostState;
  }
}

export const gamificationCoreInstance = new GamificationCore();
