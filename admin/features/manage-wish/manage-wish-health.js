/**
 * Manage Wish Feature - Sheet Health & Quota Checker
 * Path: admin/features/manage-wish/manage-wish-health.js
 */

import { MANAGE_WISH_CONFIG } from './manage-wish-config.js';

export class ManageWishHealth {
  constructor() {
    this.healthEndpoint = '/api/sheets?action=health_check';
  }

  /**
   * Check API Connection & Google Drive Quota
   */
  async checkSheetHealth() {
    try {
      const response = await fetch(this.healthEndpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Health check failed');

      const isQuotaWarning = data.quotaUsedPercent >= MANAGE_WISH_CONFIG.quotaWarningThreshold;

      return {
        success: true,
        isConnected: data.isConnected,
        quotaUsedPercent: data.quotaUsedPercent,
        latencyMs: data.latencyMs,
        status: isQuotaWarning ? 'WARNING' : 'HEALTHY',
        message: isQuotaWarning ? 'API Quota high! Consider cleanup.' : 'All services operational.'
      };
    } catch (error) {
      console.error('[ManageWishHealth] Health Check Error:', error);
      return {
        success: false,
        isConnected: false,
        status: 'CRITICAL',
        message: error.message
      };
    }
  }
}

export const manageWishHealthInstance = new ManageWishHealth();
