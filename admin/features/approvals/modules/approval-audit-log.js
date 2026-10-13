/**
 * Immutable Decision Audit Trail Logger
 * File: admin/features/approvals/modules/approval-audit-log.js
 */

import { APPROVAL_CONFIG } from '../approvals-config.js';

export class ApprovalAuditLog {
    constructor() {
        this.storageKey = APPROVAL_CONFIG.STORAGE_KEYS.AUDIT_LOG;
        this.logs = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    /**
     * Add Immutable Audit Entry
     */
    addEntry(entryData) {
        const auditRecord = {
            id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString(),
            ...entryData
        };

        this.logs.unshift(auditRecord);
        this.saveState();
        return auditRecord;
    }

    /**
     * Save to Local Storage
     */
    saveState() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    }

    /**
     * Get All Audit Logs
     */
    getLogs() {
        return this.logs;
    }
}
