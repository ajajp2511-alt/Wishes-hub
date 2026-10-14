/**
 * Mini Interactive Festive Games Engine
 * Path: admin/features/automation/modules/automation-festive-games.js
 * Description: Renders lightweight interactive mini-games on wish cards
 *              (e.g. Light the Diya, Color Splash, Balloon Pop) to boost engagement
 *              and reveal personalized greetings + sponsor offer coupons.
 */

import { automationCore } from '../automation-core.js';

export class AutomationFestiveGamesEngine {
  constructor() {
    this.core = automationCore;
    this.gameRegistry = {
      light_the_diya: {
        id: 'light_the_diya',
        title: '🪔 Light All 5 Diyas',
        instruction: 'Tap each diya to light up your Diwali wishes!',
        targetScore: 5,
        type: 'TAP_COLLECTOR',
        rewardType: 'GREETING_AND_SPONSOR_COUPON'
      },
      balloon_pop: {
        id: 'balloon_pop',
        title: '🎈 Pop 10 New Year Balloons',
        instruction: 'Pop the floating balloons to unlock the party surprise!',
        targetScore: 10,
        type: 'TAP_BURST',
        rewardType: '3D_FIREWORKS_REVEAL'
      },
      color_splash: {
        id: 'color_splash',
        title: '🎨 Color Splash Challenge',
        instruction: 'Throw color gulal on screen to reveal the Holi quote!',
        targetScore: 3,
        type: 'SWIPE_SPLASH',
        rewardType: 'COLORFUL_GREETING'
      }
    };
  }

  /**
   * Get Game Configuration for Festival
   */
  getGameConfig(gameId = 'light_the_diya') {
    const game = this.gameRegistry[gameId] || this.gameRegistry['light_the_diya'];
    this.core.log('FESTIVE_GAMES', `Retrieved game configuration: ${game.id}`, 'INFO');
    return { ...game };
  }

  /**
   * Verify Game Completion and Generate Completion Event
   */
  completeGame(gameId, scoreAchieved, sponsorData = null) {
    const game = this.getGameConfig(gameId);
    const isSuccess = scoreAchieved >= game.targetScore;

    const result = {
      gameId,
      score: scoreAchieved,
      targetScore: game.targetScore,
      completed: isSuccess,
      reward: isSuccess ? {
        unlocked: true,
        couponCode: sponsorData?.offerCoupon?.code || 'GAME100',
        discountText: sponsorData?.offerCoupon?.discountText || 'Special Game Reward Discount!',
        businessName: sponsorData?.businessName || 'Wishes Hub Partner'
      } : null,
      completedAt: new Date().toISOString()
    };

    if (isSuccess) {
      this.core.log('FESTIVE_GAMES', `Game ${gameId} successfully completed! Reward unlocked.`, 'SUCCESS');
    }

    return result;
  }
}

export const automationFestiveGames = new AutomationFestiveGamesEngine();
