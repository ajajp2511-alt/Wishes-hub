/**
 * Profit Margin Tracker, Revenue Stats & Commission Reporter
 * Path: admin/features/coupons/admin-margin-analytics.js
 * Description: Calculates gross turnover, profit margins, B2B partner commissions,
 *              and generates real-time financial reporting metrics.
 */

import { couponsCore } from './coupons-core.js';

export class AdminMarginAnalyticsEngine {
  constructor() {
    this.core = couponsCore;
  }

  /**
   * Record Transaction Sale for Analytics
   */
  recordSale(transaction) {
    const saleRecord = {
      transactionId: transaction.id || 'TXN_' + Date.now(),
      couponId: transaction.couponId,
      brandName: transaction.brandName,
      faceValueINR: Number(transaction.faceValueINR) || 0,
      sellingPriceINR: Number(transaction.sellingPriceINR) || 0,
      platformProfitINR: Number(transaction.platformProfitINR) || 0,
      commissionEarnedINR: Number(transaction.commissionEarnedINR) || 0,
      paymentMethod: transaction.paymentMethod || 'UPI',
      timestamp: new Date().toISOString()
    };

    this.core.state.activeTransactions.unshift(saleRecord);
    this.core.log('ANALYTICS', `Recorded sale [${saleRecord.transactionId}] - Revenue: ₹${saleRecord.sellingPriceINR}, Profit: ₹${saleRecord.platformProfitINR}`, 'SUCCESS');
    
    return saleRecord;
  }

  /**
   * Aggregate Financial Summary Metrics
   */
  getFinancialSummary() {
    const txns = this.core.state.activeTransactions;

    const summary = txns.reduce((acc, curr) => {
      acc.totalVolumeCount += 1;
      acc.grossTurnoverINR += curr.sellingPriceINR;
      acc.totalFaceValueDispatchedINR += curr.faceValueINR;
      acc.totalPlatformProfitINR += curr.platformProfitINR;
      acc.totalPartnerCommissionPaidINR += curr.commissionEarnedINR;
      return acc;
    }, {
      totalVolumeCount: 0,
      grossTurnoverINR: 0,
      totalFaceValueDispatchedINR: 0,
      totalPlatformProfitINR: 0,
      totalPartnerCommissionPaidINR: 0
    });

    summary.netProfitINR = summary.totalPlatformProfitINR - summary.totalPartnerCommissionPaidINR;
    summary.averageMarginPercent = summary.grossTurnoverINR > 0 
      ? parseFloat(((summary.totalPlatformProfitINR / summary.grossTurnoverINR) * 100).toFixed(2)) 
      : 0;

    return summary;
  }
}

export const adminMarginAnalytics = new AdminMarginAnalyticsEngine();
