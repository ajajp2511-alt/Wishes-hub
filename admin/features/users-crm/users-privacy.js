/**
 * Users & CRM Module - Privacy Vault & Audit Engine
 * Path: admin/features/users-crm/users-privacy.js
 */

import { PRIVACY_CONFIG, USERS_CONFIG } from './users-config.js';

export class UsersPrivacy {
  constructor() {
    this.auditLogs = [];
  }

  /**
   * Export user data for GDPR / Privacy Compliance
   */
  async exportUserData(userId) {
    try {
      const response = await fetch(`${USERS_CONFIG.endpoints.exportPrivacyData}?userId=${userId}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Data export failed');

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `user_gdpr_export_${userId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      this.logAuditAction('GDPR_EXPORT', userId, 'User data exported');
      return { success: true };
    } catch (error) {
      console.error('[UsersPrivacy] GDPR Export Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Hard-purge user account (Right to be Forgotten)
   */
  async purgeUserAccount(userId, reason = 'User requested deletion') {
    try {
      const response = await fetch(USERS_CONFIG.endpoints.purgeUser, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Account purge failed');

      this.logAuditAction('PURGE_ACCOUNT', userId, `Reason: ${reason}`);
      return { success: true };
    } catch (error) {
      console.error('[UsersPrivacy] Purge Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Mask Personally Identifiable Information (PII)
   */
  anonymizePII(emailStr) {
    if (!emailStr || !emailStr.includes('@')) return '***@***.com';
    const [name, domain] = emailStr.split('@');
    const maskedName = name.charAt(0) + '***' + name.charAt(name.length - 1);
    return `${maskedName}@${domain}`;
  }

  /**
   * Record Admin Audit Trail for Sensitive Privacy Actions
   */
  logAuditAction(actionType, targetUserId, details) {
    if (!PRIVACY_CONFIG.enableAuditLogging) return;

    const logEntry = {
      id: `AUDIT_${Date.now()}`,
      actionType,
      targetUserId,
      details,
      timestamp: new Date().toISOString()
    };

    this.auditLogs.unshift(logEntry);
  }
}

export const usersPrivacyInstance = new UsersPrivacy();
