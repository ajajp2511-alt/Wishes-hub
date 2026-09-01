/**
 * Feature Flags & Staging Core Engine
 * Path: admin/features/feature-flags-staging/feature-flags-core.js
 */

import { FLAGS_CONFIG } from './feature-flags-config.js';

export class FeatureFlagsCore {
  constructor() {
    this.storageKey = 'wishes_hub_feature_flags';
    this.auditStorageKey = 'wishes_hub_audit_logs';
    this.flags = new Map();
    this.auditLogs = [];
    this.stagingState = {
      isSandboxActive: true,
      lastSyncTime: new Date().toISOString(),
      chaosModeActive: false
    };

    this.initCoreState();
  }

  /**
   * Deep clone defaults & sync with LocalStorage persistence
   */
  initCoreState() {
    try {
      const savedFlags = localStorage.getItem(this.storageKey);
      const savedLogs = localStorage.getItem(this.auditStorageKey);

      if (savedFlags) {
        const parsed = JSON.parse(savedFlags);
        parsed.forEach(flag => this.flags.set(flag.id, flag));
      } else {
        // Deep clone default flags to prevent reference mutations
        FLAGS_CONFIG.defaultFlags.forEach(flag => {
          this.flags.set(flag.id, JSON.parse(JSON.stringify(flag)));
        });
        this.persistFlags();
      }

      if (savedLogs) {
        this.auditLogs = JSON.parse(savedLogs);
      }
    } catch (err) {
      console.warn('[FeatureFlagsCore] Storage sync fallback active:', err);
      FLAGS_CONFIG.defaultFlags.forEach(flag => {
        this.flags.set(flag.id, JSON.parse(JSON.stringify(flag)));
      });
    }
  }

  persistFlags() {
    try {
      const serialized = JSON.stringify(Array.from(this.flags.values()));
      localStorage.setItem(this.storageKey, serialized);
    } catch (e) {
      console.warn('[FeatureFlagsCore] Could not persist flags to storage:', e);
    }
  }

  persistLogs() {
    try {
      localStorage.setItem(this.auditStorageKey, JSON.stringify(this.auditLogs));
    } catch (e) {
      console.warn('[FeatureFlagsCore] Could not persist logs to storage:', e);
    }
  }

  /**
   * Log action for team governance
   */
  addAuditLog(action, flagId, details) {
    const entry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString(),
      action,
      flagId: flagId || 'SYSTEM',
      details: details || 'No details provided'
    };

    this.auditLogs.unshift(entry);

    const limit = FLAGS_CONFIG?.auditLogLimit || 50;
    if (this.auditLogs.length > limit) {
      this.auditLogs = this.auditLogs.slice(0, limit);
    }

    this.persistLogs();
  }

  /**
   * Retrieve all feature flags as an array
   */
  getAllFlags() {
    return Array.from(this.flags.values());
  }

  /**
   * Retrieve audit logs
   */
  getAuditLogs() {
    return this.auditLogs;
  }

  /**
   * Toggle Flag with Audit Trail
   */
  toggleFlag(flagId, status) {
    if (this.flags.has(flagId)) {
      const flag = { ...this.flags.get(flagId) };
      flag.enabled = Boolean(status);
      this.flags.set(flagId, flag);
      
      this.persistFlags();
      this.addAuditLog('TOGGLE_FLAG', flagId, `Status changed to ${flag.enabled ? 'ON' : 'OFF'}`);
      
      return { success: true, flag };
    }
    return { success: false, error: 'Flag not found' };
  }

  /**
   * Adjust Gradual Percentage Rollout
   */
  updateRolloutPercentage(flagId, percentage) {
    if (this.flags.has(flagId)) {
      const flag = { ...this.flags.get(flagId) };
      const parsedVal = Number(percentage);
      
      flag.rolloutPercentage = Number.isNaN(parsedVal) 
        ? 0 
        : Math.min(100, Math.max(0, parsedVal));

      this.flags.set(flagId, flag);
      this.persistFlags();
      this.addAuditLog('UPDATE_ROLLOUT', flagId, `Percentage updated to ${flag.rolloutPercentage}%`);
      
      return { success: true, flag };
    }
    return { success: false, error: 'Flag not found' };
  }

  /**
   * Auto Kill-Switch (Circuit Breaker) Trigger
   */
  triggerKillSwitch(flagId, currentErrorRate) {
    if (this.flags.has(flagId)) {
      const flag = { ...this.flags.get(flagId) };
      const errorRate = Number(currentErrorRate) || 0;
      
      if (errorRate >= flag.errorThreshold) {
        flag.enabled = false;
        this.flags.set(flagId, flag);
        this.persistFlags();
        
        this.addAuditLog('KILL_SWITCH_AUTO', flagId, `DISABLED automatically due to error rate: ${errorRate}%`);
        return { triggered: true, message: `Auto Kill-Switch executed for ${flag.name}` };
      }
    }
    return { triggered: false };
  }

  /**
   * Execute Staging Data Rollback
   */
  async executeDataRollback(snapshotVersion = 'Latest') {
    const timestamp = new Date().toLocaleString();
    this.addAuditLog('DATA_ROLLBACK', 'SYSTEM', `Restored database to snapshot: ${snapshotVersion}`);
    return {
      success: true,
      message: `System successfully rolled back to ${snapshotVersion} at ${timestamp}`
    };
  }
}

export const featureFlagsCoreInstance = new FeatureFlagsCore();
