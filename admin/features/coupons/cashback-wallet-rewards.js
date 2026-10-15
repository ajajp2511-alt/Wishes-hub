/**
 * Customer Cashback Points Accumulator & Referral Reward Tracker
 * Path: admin/features/coupons/cashback-wallet-rewards.js
 * Description: Calculates user wallet cashback on purchases, processes referral rewards,
 *              and manages reward balance redemptions.
 */

import { COUPONS_CONFIG } from './coupons-config.js';
import { couponsCore } from './coupons-core.js';

export class CashbackWalletRewardsEngine {
  constructor() {
    this.config = COUPONS_CONFIG;
    this.core = couponsCore;
  }

  /**
   * Process Post-Purchase Cashback Credit
   */
  processCashbackCredit(userId, purchaseAmountINR) {
    const cashbackRate = this.config.financials.cashbackPercentage || 2.5;
    const earnedCashbackINR = parseFloat(((purchaseAmountINR * cashbackRate) / 100).toFixed(2));

    this.core.state.userWalletBalance += earnedCashbackINR;

    this.core.log('REWARDS', `Credited ₹${earnedCashbackINR} cashback to User [${userId}]. New Wallet Balance: ₹${this.core.state.userWalletBalance}`, 'SUCCESS');

    return {
      earnedCashbackINR,
      newWalletBalanceINR: this.core.state.userWalletBalance
    };
  }

  /**
   * Process Referral Bonus Award
   */
  processReferralReward(referrerUserId, refereeUserId) {
    const bonusPoints = this.config.financials.referralBonusPoints || 100;
    
    this.core.log('REWARDS', `Awarded ${bonusPoints} referral points to User [${referrerUserId}] for inviting [${refereeUserId}]`, 'SUCCESS');
    
    return {
      success: true,
      referrerUserId,
      bonusPointsAwarded: bonusPoints
    };
  }
}

export const cashbackWalletRewards = new CashbackWalletRewardsEngine();
