/**
 * Wishes Hub - Ads Approval & Workflow Guard
 * File: admin/features/ads/modules/ads-approval-guard.js
 * Description: Inspection engine for incoming local ad requests, AI drafts,
 *              free template assisted requests, and one-click approvals.
 */

import { ADS_CONFIG } from '../ads-config.js';

export class AdsApprovalGuard {
  constructor(coreInstance) {
    this.core = coreInstance;
  }

  /**
   * Get List of Pending Requests Waiting for Approval
   * @returns {Array} Pending Requests
   */
  getPendingQueue() {
    return this.core.state.pendingRequests.filter(
      req => req.status === ADS_CONFIG.STATUS.PENDING_APPROVAL ||
             req.status === ADS_CONFIG.STATUS.FREE_TEMPLATE_REQUEST
    );
  }

  /**
   * Approve a Request and Move to Active Campaigns Queue
   * @param {string} requestId 
   * @param {Object} approvalMeta (Optional custom pricing or notes)
   * @returns {Object|null} Approved Ad Object
   */
  approveRequest(requestId, approvalMeta = {}) {
    const requestIndex = this.core.state.pendingRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
      console.error(`[AdsApprovalGuard] Request ID ${requestId} not found.`);
      return null;
    }

    const request = this.core.state.pendingRequests[requestIndex];

    // Calculate Final Approved Price
    const priceCalculation = this.core.calculateDynamicPrice(
      request.zoneId,
      request.areaScope,
      request.durationDays,
      request.format === 'video'
    );

    const approvedAd = {
      adId: 'AD_LIVE_' + Date.now(),
      requestId: request.id,
      businessName: request.businessName,
      contactName: request.contactName,
      whatsapp: request.whatsapp,
      city: request.city,
      zoneId: request.zoneId,
      format: request.format,
      areaScope: request.areaScope,
      startDate: approvalMeta.startDate || new Date().toISOString(),
      durationDays: request.durationDays,
      billingAmount: approvalMeta.customPrice || priceCalculation.finalAmount,
      creativeUrl: approvalMeta.creativeUrl || request.creativeUrl || 'https://cdn.wishes-hub.com/sample-ad.jpg',
      status: ADS_CONFIG.STATUS.ACTIVE,
      isFreeAd: request.isFreeRequest || false,
      approvedAt: new Date().toISOString()
    };

    // Remove from pending & add to active ads
    this.core.state.pendingRequests.splice(requestIndex, 1);
    this.core.state.activeAds.push(approvedAd);

    // Save Storage
    this.core.setStorageItem(ADS_CONFIG.STORAGE_KEYS.PENDING_REQUESTS, this.core.state.pendingRequests);
    this.core.setStorageItem(ADS_CONFIG.STORAGE_KEYS.ACTIVE_ADS, this.core.state.activeAds);

    return approvedAd;
  }

  /**
   * Reject a Pending Request with Reason
   * @param {string} requestId 
   * @param {string} reason 
   * @returns {boolean} Success Status
   */
  rejectRequest(requestId, reason = 'Quality policy non-compliance') {
    const request = this.core.state.pendingRequests.find(r => r.id === requestId);
    if (!request) return false;

    request.status = ADS_CONFIG.STATUS.REJECTED;
    request.rejectionReason = reason;
    request.rejectedAt = new Date().toISOString();

    this.core.setStorageItem(ADS_CONFIG.STORAGE_KEYS.PENDING_REQUESTS, this.core.state.pendingRequests);
    return true;
  }
}
