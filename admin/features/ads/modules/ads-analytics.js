/**
 * Wishes Hub - Ads Impression & CTR Analytics Engine
 * File: admin/features/ads/modules/ads-analytics.js
 * Description: Tracks local ad impressions, clicks, CTR percentages, 
 *              and produces analytics summaries.
 */

export class AdsAnalytics {
  constructor() {
    this.analyticsKey = 'wishes_hub_ads_analytics_data';
  }

  /**
   * Track an impression or click event
   * @param {string} adId 
   * @param {string} eventType ('IMPRESSION' | 'CLICK')
   */
  trackEvent(adId, eventType = 'IMPRESSION') {
    const data = this.getAnalyticsData();
    if (!data[adId]) {
      data[adId] = { impressions: 0, clicks: 0 };
    }

    if (eventType === 'IMPRESSION') data[adId].impressions += 1;
    if (eventType === 'CLICK') data[adId].clicks += 1;

    this.saveAnalyticsData(data);
  }

  /**
   * Get Performance Metrics for Ad ID
   * @param {string} adId 
   * @returns {Object} Stats
   */
  getAdStats(adId) {
    const data = this.getAnalyticsData();
    const stats = data[adId] || { impressions: 0, clicks: 0 };
    const ctr = stats.impressions > 0 ? ((stats.clicks / stats.impressions) * 100).toFixed(2) : '0.00';

    return { ...stats, ctrPercent: ctr };
  }

  getAnalyticsData() {
    try {
      const d = localStorage.getItem(this.analyticsKey);
      return d ? JSON.parse(d) : {};
    } catch (e) {
      return {};
    }
  }

  saveAnalyticsData(d) {
    try {
      localStorage.setItem(this.analyticsKey, JSON.stringify(d));
    } catch (e) {
      console.error(e);
    }
  }
}
