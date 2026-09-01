/**
 * Manage Wish Feature - Sheet Health & Quota Checker
 * Path: admin/features/manage-wish/modules/manage-wish-health.js
 */

import { MANAGE_WISH_CONFIG } from '../manage-wish-config.js';

export class ManageWishHealth {
  constructor() {
    this.healthEndpoint = '/api/sheets?action=health_check';
  }

  async checkSheetHealth() {
    try {
      const response = await fetch(this.healthEndpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Health check failed');

      const isQuotaWarning = (data.quotaUsedPercent || 0) >= (MANAGE_WISH_CONFIG?.quotaWarningThreshold || 80);

      return {
        success: true,
        isConnected: data.isConnected ?? true,
        quotaUsedPercent: data.quotaUsedPercent || 0,
        latencyMs: data.latencyMs || 0,
        status: isQuotaWarning ? 'WARNING' : 'HEALTHY',
        message: isQuotaWarning ? 'API Quota high! Consider cleanup.' : 'All services operational.'
      };
    } catch (error) {
      console.warn('[ManageWishHealth] Health Check Error:', error);
      return {
        success: false,
        isConnected: false,
        quotaUsedPercent: 0,
        status: 'CRITICAL',
        message: error.message || 'Offline / API unreachable'
      };
    }
  }
}

export const manageWishHealthInstance = new ManageWishHealth();
