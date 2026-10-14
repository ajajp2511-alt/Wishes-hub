/**
 * Self-Service Business Logo Overlay Engine
 * Path: admin/features/automation/modules/automation-logo-overlay.js
 * Description: Injects active paid sponsor business logos into festival wish pages and 3D scenes.
 *              Strictly restricted to 'Marketing' category pages.
 */

import { AUTOMATION_CONFIG } from '../automation-config.js';
import { automationCore } from '../automation-core.js';

export class AutomationLogoOverlayEngine {
  constructor() {
    this.config = AUTOMATION_CONFIG;
    this.core = automationCore;
  }

  /**
   * Verify if sponsor is active and paid via self-service marketing page
   */
  verifySponsorEligibility(sponsorData, pageCategory) {
    // Rule 1: Strict Category Restriction (Marketing Only)
    if (pageCategory !== this.config.marketingSponsorship.strictCategoryFilter) {
      return { eligible: false, reason: 'Branding is restricted to Marketing pages.' };
    }

    // Rule 2: Payment verification guard
    if (sponsorData.paymentStatus !== 'PAYMENT_VERIFIED_SPONSOR') {
      return { eligible: false, reason: 'Payment not verified for sponsor.' };
    }

    // Rule 3: Expiry Check
    const expiryDate = new Date(sponsorData.expiryTimestamp);
    if (expiryDate < new Date()) {
      return { eligible: false, reason: 'Sponsorship package expired.' };
    }

    return { eligible: true };
  }

  /**
   * Generate Logo Overlay CSS Frame Configuration
   */
  generateOverlayConfig(sponsorData, pageCategory = 'Marketing') {
    const verification = this.verifySponsorEligibility(sponsorData, pageCategory);

    if (!verification.eligible) {
      this.core.log('LOGO_OVERLAY', `Sponsor ${sponsorData.businessName || sponsorData.id} rejected: ${verification.reason}`, 'WARN');
      return { active: false, reason: verification.reason };
    }

    const overlayConfig = {
      active: true,
      businessName: sponsorData.businessName,
      logoUrl: sponsorData.logoUrl,
      tagline: sponsorData.tagline || 'Festive Offers Available',
      badgeText: `Co-Sponsored By ${sponsorData.businessName}`,
      position: sponsorData.position || 'bottom-right',
      frameStyle: 'glassmorphism-gold-border',
      offerCoupon: sponsorData.offerCoupon || null,
      redirectUrl: sponsorData.websiteUrl || sponsorData.whatsappNumber ? `https://wa.me/${sponsorData.whatsappNumber}` : '#'
    };

    this.core.log('LOGO_OVERLAY', `Successfully generated logo overlay for ${sponsorData.businessName}`, 'SUCCESS');
    return overlayConfig;
  }

  /**
   * Register new self-service paid sponsor
   */
  registerPaidSponsor(sponsorPayload) {
    const newSponsor = {
      id: 'sp_' + Date.now(),
      businessName: sponsorPayload.businessName,
      logoUrl: sponsorPayload.logoUrl,
      tagline: sponsorPayload.tagline || '',
      whatsappNumber: sponsorPayload.whatsappNumber,
      paymentStatus: 'PAYMENT_VERIFIED_SPONSOR',
      packageId: sponsorPayload.packageId || 'pkg_festive_starter',
      registeredAt: new Date().toISOString(),
      expiryTimestamp: new Date(Date.now() + (sponsorPayload.durationDays || 7) * 24 * 60 * 60 * 1000).toISOString()
    };

    this.core.state.activeSponsors.unshift(newSponsor);
    this.core.state.metrics.totalSponsorsOnboarded++;
    this.core.log('LOGO_OVERLAY', `Registered self-service sponsor: ${newSponsor.businessName}`, 'SUCCESS');
    this.core.saveState();
    return newSponsor;
  }
}

export const automationLogoOverlay = new AutomationLogoOverlayEngine();
