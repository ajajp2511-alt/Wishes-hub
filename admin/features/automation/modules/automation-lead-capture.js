/**
 * Local Offer Coupon & Lead Capture Engine
 * Path: admin/features/automation/modules/automation-lead-capture.js
 * Description: Renders interactive local shop discount popups, generates lead forms,
 *              and captures customer phone numbers for paid sponsor businesses.
 */

import { automationCore } from '../automation-core.js';

export class AutomationLeadCaptureEngine {
  constructor() {
    this.core = automationCore;
    this.capturedLeads = [];
  }

  /**
   * Build Coupon Popup Modal Metadata
   */
  buildCouponPopupConfig(sponsorData, festivalName = 'Festive Season') {
    if (!sponsorData || !sponsorData.offerCoupon) {
      return { enabled: false };
    }

    const popupConfig = {
      enabled: true,
      title: `🎉 ${festivalName} Special Offer!`,
      businessName: sponsorData.businessName,
      discountText: sponsorData.offerCoupon.discountText || 'Get Special Festive Discount',
      couponCode: sponsorData.offerCoupon.code || 'FESTIVE100',
      description: `Enter your WhatsApp number to claim coupon at ${sponsorData.businessName}!`,
      buttonText: 'Claim Coupon on WhatsApp',
      sponsorWhatsApp: sponsorData.whatsappNumber
    };

    this.core.log('LEAD_CAPTURE', `Built lead capture popup config for ${sponsorData.businessName}`, 'INFO');
    return popupConfig;
  }

  /**
   * Process & Capture Visitor Lead
   */
  captureLead({ sponsorId, visitorName, phone, couponCode }) {
    if (!phone || phone.length < 8) {
      return { success: false, error: 'Valid phone number is required.' };
    }

    const leadEntry = {
      id: 'lead_' + Date.now(),
      sponsorId,
      visitorName: visitorName || 'Valued Customer',
      phone,
      couponCode,
      capturedAt: new Date().toISOString()
    };

    this.capturedLeads.unshift(leadEntry);
    this.core.log('LEAD_CAPTURE', `Captured lead for Sponsor ID ${sponsorId} from ${phone}`, 'SUCCESS');
    
    return {
      success: true,
      lead: leadEntry,
      whatsappRedirectionUrl: `https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I claimed your festive coupon code ${couponCode} on Wishes Hub!`)}`
    };
  }

  /**
   * Get Captured Leads for Sponsor Dashboard
   */
  getLeadsBySponsor(sponsorId) {
    return this.capturedLeads.filter(l => l.sponsorId === sponsorId);
  }
}

export const automationLeadCapture = new AutomationLeadCaptureEngine();
