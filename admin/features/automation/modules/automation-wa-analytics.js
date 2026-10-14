/**
 * Sponsor WhatsApp Performance Digest Engine
 * Path: admin/features/automation/modules/automation-wa-analytics.js
 * Description: Compiles real-time campaign performance analytics (views, logo clicks, coupon claims)
 *              and formats 1-click WhatsApp digest reports for active sponsor businesses.
 */

import { automationCore } from '../automation-core.js';

export class AutomationWAAnalyticsEngine {
  constructor() {
    this.core = automationCore;
    this.analyticsStore = new Map();
  }

  /**
   * Record Engagement Event for Sponsor Campaign
   */
  trackEvent(sponsorId, eventType) { // eventType: 'VIEW', 'LOGO_CLICK', 'COUPON_CLAIM', 'SHARE'
    if (!this.analyticsStore.has(sponsorId)) {
      this.analyticsStore.set(sponsorId, {
        views: 0,
        logoClicks: 0,
        couponClaims: 0,
        shares: 0,
        lastUpdated: new Date().toISOString()
      });
    }

    const currentData = this.analyticsStore.get(sponsorId);
    if (eventType === 'VIEW') currentData.views++;
    if (eventType === 'LOGO_CLICK') currentData.logoClicks++;
    if (eventType === 'COUPON_CLAIM') currentData.couponClaims++;
    if (eventType === 'SHARE') currentData.shares++;

    currentData.lastUpdated = new Date().toISOString();
    this.core.log('WA_ANALYTICS', `Tracked event [${eventType}] for Sponsor ID ${sponsorId}`, 'INFO');
  }

  /**
   * Generate WhatsApp Performance Digest Message
   */
  generateSponsorDigestReport(sponsorData) {
    const metrics = this.analyticsStore.get(sponsorData.id) || {
      views: 0,
      logoClicks: 0,
      couponClaims: 0,
      shares: 0
    };

    const reportMessage = `📊 *Real-Time Campaign Performance Report* 📊\n\n` +
      `*Business Name:* ${sponsorData.businessName}\n` +
      `*Active Package:* ${sponsorData.packageId || 'Festive Sponsorship'}\n\n` +
      `📈 *Campaign Metrics Summary:*\n` +
      `• 👁️ *Total Wish Card Views:* ${metrics.views}\n` +
      `• 🎯 *Logo & Tagline Clicks:* ${metrics.logoClicks}\n` +
      `• 🎟️ *Coupon Claims:* ${metrics.couponClaims}\n` +
      `• 🔄 *Viral Shares:* ${metrics.shares}\n\n` +
      `Thank you for partnering with Wishes Hub B2B Network! 🚀\n` +
      `View Full Dashboard: https://wishes-hub.com/sponsor/dashboard?id=${sponsorData.id}`;

    const digestPayload = {
      sponsorId: sponsorData.id,
      businessName: sponsorData.businessName,
      whatsappNumber: sponsorData.whatsappNumber,
      metrics,
      reportMessage,
      whatsappDirectLink: `https://wa.me/${sponsorData.whatsappNumber}?text=${encodeURIComponent(reportMessage)}`,
      generatedAt: new Date().toISOString()
    };

    this.core.log('WA_ANALYTICS', `Generated WhatsApp digest report for ${sponsorData.businessName}`, 'SUCCESS');
    return digestPayload;
  }
}

export const automationWAAnalytics = new AutomationWAAnalyticsEngine();
