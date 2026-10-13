/**
 * SLA Timer, Priority Routing & Access Boundary Guard
 * File: admin/features/approvals/modules/approval-priority-router.js
 */

import { APPROVAL_CONFIG } from '../approvals-config.js';

export class ApprovalPriorityRouter {
    /**
     * Calculate SLA Countdown & Expiry State
     */
    static calculateSlaStatus(request) {
        const priorityConfig = APPROVAL_CONFIG.PRIORITIES[request.priority] || APPROVAL_CONFIG.PRIORITIES.P2_NORMAL;
        const createdAtMs = new Date(request.createdAt).getTime();
        const slaLimitMs = priorityConfig.slaHours * 3600 * 1000;
        const deadlineMs = createdAtMs + slaLimitMs;
        const nowMs = Date.now();
        const remainingMs = deadlineMs - nowMs;

        const isExpired = remainingMs <= 0;
        const remainingHours = (remainingMs / (3600 * 1000)).toFixed(1);

        return {
            priorityLabel: priorityConfig.label,
            slaHours: priorityConfig.slaHours,
            isExpired,
            remainingHours: isExpired ? 0 : remainingHours,
            requiresSuperAdmin: priorityConfig.requiresSuperAdmin,
            displayStatus: isExpired ? '⚠️ SLA BREACHED' : `⏱️ ${remainingHours}h remaining`
        };
    }

    /**
     * Validate Router Access for Current User Role
     */
    static canUserProcessRequest(userRole, request) {
        if (userRole === APPROVAL_CONFIG.ROLES.SUPER_ADMIN) return true;

        const categoryConfig = APPROVAL_CONFIG.CATEGORIES[request.category];
        if (categoryConfig && categoryConfig.minRoleRequired === APPROVAL_CONFIG.ROLES.SUPER_ADMIN) {
            return false;
        }

        return request.scope !== APPROVAL_CONFIG.SCOPES.ADMIN;
    }
}
