/**
 * Gamification & Rewards Configuration
 * Path: admin/features/gamification-rewards/gamification-config.js
 */

export const GAMIFICATION_CONFIG = {
  streakConfig: [
    { day: 1, points: 10 },
    { day: 2, points: 20 },
    { day: 3, points: 30 },
    { day: 4, points: 50 },
    { day: 5, points: 100 }
  ],
  referralPoints: 150,
  spinWheelSlices: [
    { label: '50 Points', type: 'POINTS', probability: 40 },
    { label: 'Premium Template Unlocked', type: 'ASSET', probability: 20 },
    { label: 'Better Luck Next Time', type: 'NONE', probability: 30 },
    { label: '500 Jackpot Points', type: 'POINTS', probability: 10 }
  ]
};
