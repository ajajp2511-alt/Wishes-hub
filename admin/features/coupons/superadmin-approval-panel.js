/**
 * Super Admin Pending Partner Approvals Queue & Credential Generator
 * Path: admin/features/coupons/superadmin-approval-panel.js
 * Description: Super admin review queue to approve/reject merchant partners,
 *              set custom commission percentages, and auto-generate API keys.
 */

import { couponsCore } from './coupons-core.js';

export class SuperadminApprovalPanelEngine {
  constructor() {
    this.core = couponsCore;
  }

  /**
   * Fetch All Pending Partner Applications
   */
  getPendingApplications() {
    return this.core.state.partnerApplications.filter(app => app.status === 'PENDING_APPROVAL');
  }

  /**
   * Generate Unique Partner API & Access Credentials
   */
  generatePartnerCredentials(companyName) {
    const slug = companyName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6);
    const partnerId = `PTR_${slug}_${Math.floor(1000 + Math.random() * 9000)}`;
    const apiKey = `wh_live_partner_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const secretKey = `sec_${Math.random().toString(36).substring(2, 18)}${Date.now().toString(36)}`;

    return { partnerId, apiKey, secretKey };
  }

  /**
   * Approve Partner Application
   */
  approvePartner(applicationId, commissionPercent = 10.0, adminNotes = 'Approved after verification.') {
    const app = this.core.state.partnerApplications.find(a => a.applicationId === applicationId);
    if (!app) {
      return { success: false, error: 'Partner application not found.' };
    }

    if (app.status === 'APPROVED') {
      return { success: false, error: 'Partner application is already approved.' };
    }

    const credentials = this.generatePartnerCredentials(app.companyName);

    app.status = 'APPROVED';
    app.approvedAt = new Date().toISOString();
    app.commissionPercent = Number(commissionPercent);
    app.adminNotes = adminNotes;
    app.credentials = credentials;

    this.core.log('SUPERADMIN_APPROVAL', `Approved partner [${app.companyName}] with ${commissionPercent}% commission. Partner ID: ${credentials.partnerId}`, 'SUCCESS');

    return {
      success: true,
      partnerId: credentials.partnerId,
      apiKey: credentials.apiKey,
      secretKey: credentials.secretKey,
      commissionPercent: app.commissionPercent
    };
  }

  /**
   * Reject Partner Application
   */
  rejectPartner(applicationId, rejectionReason = 'KYC documents incomplete.') {
    const app = this.core.state.partnerApplications.find(a => a.applicationId === applicationId);
    if (!app) {
      return { success: false, error: 'Partner application not found.' };
    }

    app.status = 'REJECTED';
    app.rejectedAt = new Date().toISOString();
    app.rejectionReason = rejectionReason;

    this.core.log('SUPERADMIN_APPROVAL', `Rejected partner [${app.companyName}]. Reason: ${rejectionReason}`, 'WARN');

    return { success: true, status: 'REJECTED', reason: rejectionReason };
  }
}

export const superadminApprovalPanel = new SuperadminApprovalPanelEngine();
