/**
 * Manage Wish Feature - Views, Shares & Performance Metrics
 * Path: admin/features/manage-wish/manage-wish-analytics.js
 */

export class ManageWishAnalytics {
  constructor() {
    this.analyticsEndpoint = '/api/analytics';
  }

  /**
   * Fetch engagement stats for a specific wish or all wishes
   */
  async getWishMetrics(wishId = null) {
    try {
      const url = wishId 
        ? `${this.analyticsEndpoint}?wishId=${wishId}` 
        : `${this.analyticsEndpoint}?action=overview`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Analytics fetch failed');

      return {
        success: true,
        metrics: {
          totalViews: data.views || 0,
          totalShares: data.shares || 0,
          uniqueVisitors: data.visitors || 0,
          conversionRate: data.conversionRate || '0%',
          deviceBreakdown: data.devices || { mobile: '0%', desktop: '0%' }
        }
      };
    } catch (error) {
      console.error('[ManageWishAnalytics] Metrics Fetch Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Quick summary calculation for local caching
   */
  calculateEngagementScore(views, shares) {
    if (!views || views === 0) return 0;
    return Math.round(((shares * 2) / views) * 100);
  }
}

export const manageWishAnalyticsInstance = new ManageWishAnalytics();
