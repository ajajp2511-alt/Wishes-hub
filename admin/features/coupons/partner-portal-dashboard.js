/**
 * Partner Merchant Self-Service Portal & Settlement Analytics
 * Path: admin/features/coupons/partner-portal-dashboard.js
 * Description: Self-service view for approved merchant partners to monitor
 *              voucher sales, manage uploaded inventory, and view earnings payouts.
 */

import { couponsCore } from './coupons-core.js';

export class PartnerPortalDashboardEngine {
  constructor() {
    this.core = couponsCore;
  }

  /**
   * Get Partner Specific Sales & Inventory Analytics
   */
  getPartnerDashboardMetrics(partnerId) {
    const partnerApp = this.core.state.partnerApplications.find(a => a.credentials && a.credentials.partnerId === partnerId);
    if (!partnerApp) {
      return { success: false, error: 'Invalid or unapproved Partner ID.' };
    }

    // Filter active sales for this partner brand
    const partnerSales = this.core.state.activeTransactions.filter(t => t.brandName === partnerApp.companyName);
    
    const grossSalesINR = partnerSales.reduce((acc, curr) => acc + curr.sellingPriceINR, 0);
    const commissionPercent = partnerApp.commissionPercent || 10.0;
    const platformCommissionINR = (grossSalesINR * commissionPercent) / 100;
    const partnerNetPayoutINR = grossSalesINR - platformCommissionINR;

    // Active partner inventory items
    const partnerInventory = this.core.state.inventoryQueue.filter(i => i.brandName === partnerApp.companyName);

    const metrics = {
      partnerId,
      companyName: partnerApp.companyName,
      commissionPercent,
      totalVouchersSold: partnerSales.length,
      grossSalesINR,
      platformCommissionINR,
      partnerNetPayoutINR,
      activeInventoryCount: partnerInventory.length,
      bankAccountFormatted: `XXXX-XXXX-${partnerApp.bankDetails.accountNumber.slice(-4)}`
    };

    this.core.log('PARTNER_PORTAL', `Generated dashboard metrics for Partner [${partnerId}]`, 'INFO');
    return { success: true, metrics };
  }
}

export const partnerPortalDashboard = new PartnerPortalDashboardEngine();
