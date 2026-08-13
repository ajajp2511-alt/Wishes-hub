/**
 * Feature Flags & Staging Core Engine
 * Path: admin/features/feature-flags-staging/feature-flags-core.js
 */

import { FLAGS_CONFIG } from './feature-flags-config.js';

export class FeatureFlagsCore {
  constructor() {
    this.flags = new Map(FLAGS_CONFIG.defaultFlags.map(f => [f.id, f]));
    this.auditLogs = [];
    this.stagingState = {
      isSandboxActive: true,
      lastSyncTime: new Date().toISOString(),
      chaosModeActive: false
    };
  }

  /**
   * Log action for team governance
   */
  addAuditLog(action, flagId, details) {
    const entry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action,
      flagId,
      details
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > FLAGS_CONFIG.auditLogLimit) {
      this.auditLogs.pop();
    }
  }

  /**
   * Toggle Flag with Audit Trail
   */
  toggleFlag(flagId, status) {
    if (this.flags.has(flagId)) {
      const flag = this.flags.get(flagId);
      flag.enabled = status;
      this.flags.set(flagId, flag);
      this.addAuditLog('TOGGLE_FLAG', flagId, `Status changed to ${status ? 'ON' : 'OFF'}`);
      return { success: true, flag };
    }
    return { success: false, error: 'Flag not found' };
  }

  /**
   * Adjust Gradual Percentage Rollout
   */
  updateRolloutPercentage(flagId, percentage) {
    if (this.flags.has(flagId)) {
      const flag = this.flags.get(flagId);
      flag.rolloutPercentage = Math.min(100, Math.max(0, Number(percentage)));
      this.flags.set(flagId, flag);
      this.addAuditLog('UPDATE_ROLLOUT', flagId, `Percentage updated to ${percentage}%`);
      return { success: true, flag };
    }
    return { success: false, error: 'Flag not found' };
  }

  /**
   * Auto Kill-Switch (Circuit Breaker) Trigger
   */
  triggerKillSwitch(flagId, currentErrorRate) {
    if (this.flags.has(flagId)) {
      const flag = this.flags.get(flagId);
      if (currentErrorRate >= flag.errorThreshold) {
        flag.enabled = false;
        this.flags.set(flagId, flag);
        this.addAuditLog('KILL_SWITCH_AUTO', flagId, `DISABLED automatically due to error rate: ${currentErrorRate}%`);
        return { triggered: true, message: `Auto Kill-Switch executed for ${flag.name}` };
      }
    }
    return { triggered: false };
  }

  /**
   * Execute Staging Data Rollback
   */
  async executeDataRollback(snapshotVersion) {
    const timestamp = new Date().toLocaleString();
    this.addAuditLog('DATA_ROLLBACK', 'SYSTEM', `Restored database to snapshot: ${snapshotVersion}`);
    return {
      success: true,
      message: `System successfully rolled back to ${snapshotVersion} at ${timestamp}`
    };
  }
}

export const featureFlagsCoreInstance = new FeatureFlagsCore();
