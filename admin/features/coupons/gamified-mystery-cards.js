/**
 * Scratch & Win Mystery Cards Engine & Random Value Reward Assigner
 * Path: admin/features/coupons/gamified-mystery-cards.js
 * Description: Powers mystery box/card purchases where users pay a fixed low price
 *              and win randomized higher-value brand vouchers.
 */

import { couponsCore } from './coupons-core.js';

export class GamifiedMysteryCardsEngine {
  constructor() {
    this.core = couponsCore;
  }

  /**
   * Mystery Box Tier Configuration
   */
  getMysteryTiers() {
    return [
      { tierId: 'TIER_BRONZE', title: 'Bronze Mystery Box', buyPriceINR: 49, possibleRewards: [100, 150, 250, 500] },
      { tierId: 'TIER_SILVER', title: 'Silver Mystery Pack', buyPriceINR: 199, possibleRewards: [350, 500, 1000, 1500] },
      { tierId: 'TIER_GOLD', title: 'Gold Mega Jackpot Box', buyPriceINR: 499, possibleRewards: [1000, 2500, 5000, 10000] }
    ];
  }

  /**
   * Spin / Open Mystery Card & Assign Random Reward
   */
  openMysteryBox(tierId) {
    const tier = this.getMysteryTiers().find(t => t.tierId === tierId);
    if (!tier) {
      return { success: false, error: 'Invalid mystery tier selected.' };
    }

    // Weighted random reward selection
    const randomIndex = Math.floor(Math.random() * tier.possibleRewards.length);
    const wonRewardValueINR = tier.possibleRewards[randomIndex];

    const mysteryResult = {
      mysteryId: 'MYSTERY_' + Date.now(),
      tierId: tier.tierId,
      tierTitle: tier.title,
      paidPriceINR: tier.buyPriceINR,
      rewardValueINR: wonRewardValueINR,
      profitToUserINR: wonRewardValueINR - tier.buyPriceINR,
      unlockedCode: `MYSTERY-WIN-${Math.floor(1000 + Math.random() * 9000)}`,
      openedAt: new Date().toISOString()
    };

    this.core.log('MYSTERY_CARDS', `User opened [${tier.title}] and won ₹${wonRewardValueINR} voucher!`, 'SUCCESS');
    return { success: true, reward: mysteryResult };
  }
}

export const gamifiedMysteryCards = new GamifiedMysteryCardsEngine();
