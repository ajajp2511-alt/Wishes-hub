/**
 * B2B Sponsor Referral & Credit Rewards Engine
 * Path: admin/features/automation/modules/automation-partner-referral.js
 * Description: Manages sponsor referral links, tracks B2B signups, and distributes 
 *              discount credits/free 3D slots to local business partners.
 */

import { automationCore } from '../automation-core.js';

export class AutomationPartnerReferralEngine {
  constructor() {
    this.core = automationCore;
    this.referralRegistry = new Map();
  }

  /**
   * Generate Unique Referral Link for a Paid Sponsor
   */
  generateSponsorReferralLink(sponsorData) {
    const refCode = `REF_${sponsorData.businessName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}_${sponsorData.id.slice(-4)}`;
    const referralUrl = `https://wishes-hub.com/sponsor-buying?ref=${refCode}`;

    const record = {
      sponsorId: sponsorData.id,
      businessName: sponsorData.businessName,
      refCode,
      referralUrl,
      successfulReferrals: 0,
      earnedCreditsINR: 0,
      free3DSlotsUnlocked: 0,
      createdAt: new Date().toISOString()
    };

    this.referralRegistry.set(refCode, record);
    this.core.log('PARTNER_REFERRAL', `Generated referral code [${refCode}] for ${sponsorData.businessName}`, 'SUCCESS');
    return record;
  }

  /**
   * Process New Sponsor Signup via Referral Code
   */
  processReferralConversion(refCode, newSponsorId) {
    if (!this.referralRegistry.has(refCode)) {
      this.core.log('PARTNER_REFERRAL', `Invalid referral code used: ${refCode}`, 'WARN');
      return { success: false, reason: 'Invalid referral code.' };
    }

    const parentSponsor = this.referralRegistry.get(refCode);
    parentSponsor.successfulReferrals++;
    parentSponsor.earnedCreditsINR += 100; // ₹100 credit per referral
    parentSponsor.free3DSlotsUnlocked += 1;

    this.core.log('PARTNER_REFERRAL', `Conversion processed! ${parentSponsor.businessName} earned ₹100 credit for referring ${newSponsorId}`, 'SUCCESS');
    this.core.saveState();

    return {
      success: true,
      rewardedSponsorId: parentSponsor.sponsorId,
      currentCreditsINR: parentSponsor.earnedCreditsINR,
      free3DSlots: parentSponsor.free3DSlotsUnlocked
    };
  }

  /**
   * Get Referral Dashboard Stats for Sponsor
   */
  getReferralStatsByCode(refCode) {
    return this.referralRegistry.get(refCode) || null;
  }
}

export const automationPartnerReferral = new AutomationPartnerReferralEngine();
