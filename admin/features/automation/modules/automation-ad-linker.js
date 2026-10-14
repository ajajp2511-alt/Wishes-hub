/**
 * Auto Local Ads Placement Engine
 * Path: admin/features/automation/modules/automation-ad-linker.js
 * Description: Dynamically injects local business sponsor banners, promotional cards,
 *              and ad slots into wish pages based on location and category.
 */

import { AUTOMATION_CONFIG } from '../automation-config.js';
import { automationCore } from '../automation-core.js';

export class AutomationAdLinkerEngine {
  constructor() {
    this.config = AUTOMATION_CONFIG;
    this.core = automationCore;
  }

  /**
   * Inject Sponsored Ad Card into Defined Ad Slot
   */
  resolveAdSlotPlacement(slotId = 'slot_below_wish', sponsorData = null, pageCategory = 'Marketing') {
    // Strict restriction guard
    if (pageCategory !== this.config.marketingSponsorship.strictCategoryFilter) {
      return { slotId, adInjected: false, reason: 'Ads restricted to Marketing pages.' };
    }

    if (!sponsorData || sponsorData.paymentStatus !== 'PAYMENT_VERIFIED_SPONSOR') {
      return {
        slotId,
        adInjected: false,
        fallbackMarkup: '<div class="wh-ad-placeholder">Promote your business here during festivals! <a href="/sponsor-buying">Learn More</a></div>'
      };
    }

    const adCard = {
      slotId,
      adInjected: true,
      businessName: sponsorData.businessName,
      logoUrl: sponsorData.logoUrl,
      tagline: sponsorData.tagline || 'Festive Offers Inside!',
      couponCode: sponsorData.offerCoupon?.code || null,
      ctaUrl: `https://wa.me/${sponsorData.whatsappNumber}?text=${encodeURIComponent(`Hi ${sponsorData.businessName}, I am interested in your festive offer!`)}`,
      renderStyle: 'card_native_banner'
    };

    this.core.log('AD_LINKER', `Injected sponsor ad for ${sponsorData.businessName} into ${slotId}`, 'SUCCESS');
    return adCard;
  }
}

export const automationAdLinker = new AutomationAdLinkerEngine();
