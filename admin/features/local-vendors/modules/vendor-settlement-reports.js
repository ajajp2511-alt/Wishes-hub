/**
 * Wishes Hub - Vendor Settlement Reports & Ledger Engine Module
 * File: modules/vendor-settlement-reports.js
 */

import { VENDOR_CONFIG } from '../local-vendors-config.js';
import { coreEngine } from '../local-vendors-core.js';

export class VendorSettlementReportsModule {
  constructor() {
    this.moduleName = 'vendor-settlement-reports';
  }

  /**
   * Generate daily or periodic financial settlement report for a vendor
   * @param {String} vendorId 
   * @param {Object} options - { startDate, endDate }
   * @returns {Object} Detailed settlement ledger report
   */
  generateSettlementReport(vendorId, options = {}) {
    if (!vendorId) {
      throw new Error('Vendor ID is required to generate settlement report.');
    }

    const vendor = coreEngine.state.activeVendors.get(vendorId);
    if (!vendor) {
      throw new Error(`Vendor not found with ID: ${vendorId}`);
    }

    const completedOrders = [];
    let totalGrossSales = 0;
    let totalPlatformFee = 0;
    let totalDeliveryEarnings = 0;
    let totalNetPayout = 0;

    // Filter vendor completed orders
    for (const [orderId, order] of coreEngine.state.activeOrders.entries()) {
      if (order.vendorId === vendorId && order.status === 'DELIVERED') {
        const orderDate = new Date(order.timestamp || Date.now());
        if (options.startDate && orderDate < new Date(options.startDate)) continue;
        if (options.endDate && orderDate > new Date(options.endDate)) continue;

        const payout = order.payoutBreakdown || {
          totalOrderValue: order.amount || 0,
          platformCommission: Math.round((order.amount || 0) * VENDOR_CONFIG.COMMISSION_RATE),
          vendorNetPayout: (order.amount || 0) - Math.round((order.amount || 0) * VENDOR_CONFIG.COMMISSION_RATE),
          deliveryRiderPayout: order.handlesSelfDelivery ? (order.deliveryFee || 0) : 0
        };

        const netEarning = payout.vendorNetPayout + (payout.deliveryRiderPayout || 0);

        totalGrossSales += payout.totalOrderValue;
        totalPlatformFee += payout.platformCommission;
        totalDeliveryEarnings += payout.deliveryRiderPayout || 0;
        totalNetPayout += netEarning;

        completedOrders.push({
          orderId,
          date: order.timestamp,
          grossAmount: payout.totalOrderValue,
          commissionDeducted: payout.platformCommission,
          selfDeliveryFee: payout.deliveryRiderPayout || 0,
          netPayoutAmount: netEarning
        });
      }
    }

    return {
      success: true,
      currency: VENDOR_CONFIG.CURRENCY,
      vendorId,
      businessName: vendor.businessName,
      bankDetails: vendor.bankDetails || { accountStatus: 'UPI_REGISTERED' },
      reportPeriod: {
        startDate: options.startDate || 'ALL_TIME',
        endDate: options.endDate || 'PRESENT'
      },
      summary: {
        totalCompletedOrders: completedOrders.length,
        totalGrossSales,
        totalPlatformFee,
        totalDeliveryEarnings,
        totalNetPayout
      },
      ordersLedger: completedOrders,
      generatedAt: new Date().toISOString()
    };
  }
}

export const vendorSettlementReports = new VendorSettlementReportsModule();
