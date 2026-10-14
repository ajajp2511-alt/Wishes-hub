/**
 * Pre-Festival WhatsApp Marketing Dispatcher
 * Path: admin/features/automation/modules/automation-sponsor-alert.js
 * Description: Dispatches automated pre-festival campaign notification alerts via WhatsApp
 *              to registered business sponsors with direct self-service marketing page links.
 */

import { AUTOMATION_CONFIG } from '../automation-config.js';
import { automationCore } from '../automation-core.js';

export class AutomationSponsorAlertEngine {
  constructor() {
    this.config = AUTOMATION_CONFIG;
    this.core = automationCore;
    this.dispatchHistory = [];
  }

  /**
   * Check upcoming festivals and filter target business leads
   */
  evaluatePreFestivalTriggers(upcomingFestivals = []) {
    const dispatchList = [];

    upcomingFestivals.forEach(fest => {
      // Trigger when festival is 3 days or 24 hours away
      if (fest.daysUntil <= 3 && fest.daysUntil >= 0) {
        dispatchList.push({
          festivalId: fest.id,
          festivalName: fest.name,
          daysUntil: fest.daysUntil,
          marketingUrl: `https://wishes-hub.com/sponsor-buying?fest=${fest.id}`
        });
      }
    });

    this.core.log('SPONSOR_ALERT', `Evaluated ${dispatchList.length} pre-festival alert triggers`, 'INFO');
    return dispatchList;
  }

  /**
   * Build WhatsApp Marketing Dispatch Payload for a Local Business
   */
  buildWhatsAppAlertPayload({ businessName, whatsappNumber, festivalName, daysUntil, marketingUrl }) {
    const timeText = daysUntil === 0 ? 'is Today!' : daysUntil === 1 ? 'is Tomorrow!' : `is in ${daysUntil} days!`;

    const message = `🌟 *Special Festival Marketing Alert for ${businessName}!* 🌟\n\n` +
      `*${festivalName}* ${timeText}\n\n` +
      `Boost your local sales by adding your shop logo & offer coupons to thousands of viral festival wish links!\n\n` +
      `👉 *Claim Your Festival Sponsorship Slot Now:*\n${marketingUrl}\n\n` +
      `_Wishes Hub B2B Self-Service Marketing Engine_`;

    const alertPayload = {
      id: 'alert_' + Date.now(),
      businessName,
      whatsappNumber,
      festivalName,
      message,
      whatsappDirectLink: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      status: 'PENDING_DISPATCH',
      createdAt: new Date().toISOString()
    };

    this.dispatchHistory.unshift(alertPayload);
    this.core.log('SPONSOR_ALERT', `Created WhatsApp alert payload for ${businessName} [Phone: ${whatsappNumber}]`, 'SUCCESS');
    return alertPayload;
  }

  /**
   * Mark alert as dispatched
   */
  markAlertDispatched(alertId) {
    const target = this.dispatchHistory.find(a => a.id === alertId);
    if (target) {
      target.status = 'DISPATCHED';
      target.dispatchedAt = new Date().toISOString();
      this.core.log('SPONSOR_ALERT', `Alert ${alertId} marked as DISPATCHED`, 'SUCCESS');
      return true;
    }
    return false;
  }
}

export const automationSponsorAlert = new AutomationSponsorAlertEngine();
