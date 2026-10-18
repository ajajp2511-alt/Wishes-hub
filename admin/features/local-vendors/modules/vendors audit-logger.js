/**
 * Wishes Hub - Vendor Audit Logger & Compliance Module
 * File: modules/vendor-audit-logger.js
 */

import { coreEngine } from '../local-vendors-core.js';

export class VendorAuditLoggerModule {
  constructor() {
    this.moduleName = 'vendor-audit-logger';
  }

  /**
   * Record a detailed compliance or system operational event
   * @param {String} vendorId 
   * @param {String} eventType - e.g., 'ONBOARDING_VERIFIED', 'STATUS_CHANGE', 'PAYOUT_SETTLED', 'COMPLAINT_FLAG'
   * @param {Object} details 
   * @returns {Object} Audit log entry
   */
  logAuditEntry(vendorId, eventType, details = {}) {
    if (!vendorId || !eventType) {
      throw new Error('Vendor ID and Event Type are required for audit logging.');
    }

    const logEntry = {
      logId: `AUDIT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      vendorId,
      eventType,
      details,
      timestamp: new Date().toISOString()
    };

    // Push log to central engine state
    coreEngine.logEvent(eventType, logEntry);

    return {
      success: true,
      logEntry
    };
  }

  /**
   * Retrieve complete audit history for a specific vendor
   * @param {String} vendorId 
   * @returns {Array} List of audit logs
   */
  getVendorAuditHistory(vendorId) {
    if (!vendorId) {
      throw new Error('Vendor ID is required to fetch audit history.');
    }

    const allLogs = coreEngine.state.auditLogs || [];
    return allLogs.filter(log => log.data && log.data.vendorId === vendorId);
  }
}

export const vendorAuditLogger = new VendorAuditLoggerModule();
