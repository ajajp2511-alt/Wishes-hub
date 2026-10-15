/**
 * Professional Merchant Sign-Up Form Handler & KYC Verification
 * Path: admin/features/coupons/b2b-partner-onboarding.js
 * Description: Manages B2B merchant/partner registration, validates company details,
 *              GSTIN/Tax IDs, bank credentials, and business document uploads.
 */

import { couponsCore } from './coupons-core.js';

export class B2BPartnerOnboardingEngine {
  constructor() {
    this.core = couponsCore;
  }

  /**
   * Validate GSTIN / Tax ID Format (Indian GST Regex Standard)
   */
  validateGSTIN(gstin) {
    if (!gstin) return false;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstin.trim().toUpperCase());
  }

  /**
   * Validate Onboarding Application Payload
   */
  validateApplication(payload) {
    if (!payload.companyName || payload.companyName.trim().length < 2) {
      return { valid: false, reason: 'Company/Business name is required.' };
    }
    if (!payload.contactPerson || payload.contactPerson.trim().length < 2) {
      return { valid: false, reason: 'Authorized contact person name is required.' };
    }
    if (!payload.officialEmail || !payload.officialEmail.includes('@')) {
      return { valid: false, reason: 'Valid official email address is required.' };
    }
    if (!payload.mobileNumber || payload.mobileNumber.trim().length < 10) {
      return { valid: false, reason: 'Valid mobile number is required.' };
    }
    if (payload.gstin && !this.validateGSTIN(payload.gstin)) {
      return { valid: false, reason: 'Invalid GSTIN format provided.' };
    }
    if (!payload.bankAccountNumber || !payload.ifscCode) {
      return { valid: false, reason: 'Bank account number and IFSC code are required for payout settlement.' };
    }

    return { valid: true };
  }

  /**
   * Submit New Merchant Partner Application
   */
  submitPartnerApplication(rawPayload) {
    const validation = this.validateApplication(rawPayload);
    if (!validation.valid) {
      this.core.log('B2B_ONBOARDING', `Validation failed: ${validation.reason}`, 'WARN');
      return { success: false, error: validation.reason };
    }

    const application = {
      applicationId: 'PARTNER_APP_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      companyName: rawPayload.companyName.trim(),
      contactPerson: rawPayload.contactPerson.trim(),
      officialEmail: rawPayload.officialEmail.trim().toLowerCase(),
      mobileNumber: rawPayload.mobileNumber.trim(),
      websiteUrl: rawPayload.websiteUrl ? rawPayload.websiteUrl.trim() : '',
      partnershipType: rawPayload.partnershipType || 'Direct Merchant', // 'API Reseller', 'Direct Merchant', 'Affiliate', 'Co-Branded Sponsor'
      gstin: rawPayload.gstin ? rawPayload.gstin.trim().toUpperCase() : 'NOT_PROVIDED',
      panNumber: rawPayload.panNumber ? rawPayload.panNumber.trim().toUpperCase() : '',
      bankDetails: {
        accountNumber: rawPayload.bankAccountNumber.trim(),
        ifscCode: rawPayload.ifscCode.trim().toUpperCase(),
        upiId: rawPayload.upiId ? rawPayload.upiId.trim() : ''
      },
      documentUrls: {
        registrationCert: rawPayload.certUrl || null,
        companyLogo: rawPayload.logoUrl || null
      },
      status: 'PENDING_APPROVAL',
      submittedAt: new Date().toISOString()
    };

    this.core.state.partnerApplications.unshift(application);
    this.core.log('B2B_ONBOARDING', `New partner application submitted for [${application.companyName}] - ID: ${application.applicationId}`, 'SUCCESS');

    return { success: true, applicationId: application.applicationId, status: application.status };
  }
}

export const b2bPartnerOnboarding = new B2BPartnerOnboardingEngine();
