/**
 * Risk Score Calculator, Anti-Fraud Guard & Suspicious Activity Checker
 * Path: admin/features/coupons/admin-fraud-prevention.js
 * Description: Calculates risk scores for voucher purchases, flags suspicious IPs,
 *              and enforces rate limits to prevent high-value fraud attempts.
 */

import { COUPONS_CONFIG } from './coupons-config.js';
import { couponsCore } from './coupons-core.js';

export class AdminFraudPreventionEngine {
  constructor() {
    this.config = COUPONS_CONFIG;
    this.core = couponsCore;
    this.ipPurchaseTracker = {};
  }

  /**
   * Evaluate Order Risk Score
   */
  evaluateOrderRisk({ ipAddress, userEmail, userPhone, orderValueINR, cartItemCount }) {
    let riskScore = 0;
    const riskFactors = [];

    // Rule 1: High Order Value Risk
    if (orderValueINR >= this.config.fraudGuard.highRiskOrderValueThresholdINR) {
      riskScore += 40;
      riskFactors.push('HIGH_ORDER_VALUE');
    }

    // Rule 2: IP Purchase Velocity Check
    const ipRecord = this.ipPurchaseTracker[ipAddress] || { count: 0, lastTime: Date.now() };
    const now = Date.now();

    // Reset window after 1 hour
    if (now - ipRecord.lastTime > 3600000) {
      ipRecord.count = 0;
      ipRecord.lastTime = now;
    }

    if (ipRecord.count >= this.config.fraudGuard.maxPurchasesPerIPPerHour) {
      riskScore += 50;
      riskFactors.push('EXCEEDED_HOURLY_IP_LIMIT');
    }

    // Rule 3: Bulk Single Item Cart Attack
    if (cartItemCount > 10) {
      riskScore += 25;
      riskFactors.push('HIGH_CART_QUANTITY');
    }

    const isFlagged = riskScore >= 50;
    const requiresOTP = riskScore >= 30 || this.config.fraudGuard.requireOTPForHighRisk;

    if (isFlagged) {
      this.core.log('FRAUD_PREVENTION', `Order flagged as HIGH RISK (Score: ${riskScore}) from IP: ${ipAddress}. Factors: ${riskFactors.join(', ')}`, 'WARN');
    }

    return {
      riskScore,
      isFlagged,
      requiresOTP,
      riskFactors,
      action: isFlagged ? 'HOLD_FOR_REVIEW' : (requiresOTP ? 'REQUIRE_OTP' : 'ALLOW')
    };
  }

  /**
   * Register Completed Purchase for IP Velocity Tracking
   */
  registerIPActivity(ipAddress) {
    if (!this.ipPurchaseTracker[ipAddress]) {
      this.ipPurchaseTracker[ipAddress] = { count: 1, lastTime: Date.now() };
    } else {
      this.ipPurchaseTracker[ipAddress].count += 1;
    }
  }
}

export const adminFraudPrevention = new AdminFraudPreventionEngine();
