/**
 * Decision Execution Engine (Approve, Reject, Revision & Override)
 * File: admin/features/approvals/modules/approval-action.js
 */

import { APPROVAL_CONFIG } from '../approvals-config.js';

export class ApprovalAction {
    constructor(approvalsCore, notifierInstance, auditLogInstance) {
        this.core = approvalsCore;
        this.notifier = notifierInstance;
        this.auditLog = auditLogInstance;
    }

    /**
     * Execute Approval Decision
     */
    approveRequest(requestId, adminUser, decisionNote = '') {
        const request = this.core.getRequestById(requestId);
        if (!request) return { success: false, message: 'Request not found or permission denied.' };

        // Hierarchy guard check
        const categoryConfig = APPROVAL_CONFIG.CATEGORIES[request.category];
        if (categoryConfig && categoryConfig.minRoleRequired === APPROVAL_CONFIG.ROLES.SUPER_ADMIN) {
            if (this.core.currentUserRole !== APPROVAL_CONFIG.ROLES.SUPER_ADMIN) {
                return { success: false, message: 'Security Block: Only Super Admin can approve this request.' };
            }
        }

        // Update Status
        request.status = APPROVAL_CONFIG.STATUS.APPROVED;
        request.processedBy = adminUser;
        request.processedAt = new Date().toISOString();
        request.decisionNote = decisionNote;

        this.core.saveState();

        // Audit Logging
        if (this.auditLog) {
            this.auditLog.addEntry({
                requestId: request.id,
                action: 'APPROVED',
                category: request.category,
                performedBy: adminUser,
                role: this.core.currentUserRole,
                note: decisionNote
            });
        }

        // Real-time Notification
        if (this.notifier) {
            this.notifier.dispatchStatusUpdate(request, 'APPROVED');
        }

        return { success: true, message: `Request ${requestId} successfully approved.` };
    }

    /**
     * Execute Rejection Decision
     */
    rejectRequest(requestId, adminUser, reason = 'Does not meet guidelines.') {
        const request = this.core.getRequestById(requestId);
        if (!request) return { success: false, message: 'Request not found or permission denied.' };

        request.status = APPROVAL_CONFIG.STATUS.REJECTED;
        request.processedBy = adminUser;
        request.processedAt = new Date().toISOString();
        request.decisionNote = reason;

        this.core.saveState();

        if (this.auditLog) {
            this.auditLog.addEntry({
                requestId: request.id,
                action: 'REJECTED',
                category: request.category,
                performedBy: adminUser,
                role: this.core.currentUserRole,
                note: reason
            });
        }

        if (this.notifier) {
            this.notifier.dispatchStatusUpdate(request, 'REJECTED');
        }

        return { success: true, message: `Request ${requestId} rejected.` };
    }

    /**
     * Request Revision / Changes Needed Feedback Loop
     */
    requestRevision(requestId, adminUser, instructions) {
        const request = this.core.getRequestById(requestId);
        if (!request) return { success: false, message: 'Request not found or permission denied.' };

        request.status = APPROVAL_CONFIG.STATUS.REVISION_REQUESTED;
        request.revisionNotes = instructions;
        request.updatedAt = new Date().toISOString();

        this.core.saveState();

        if (this.auditLog) {
            this.auditLog.addEntry({
                requestId: request.id,
                action: 'REVISION_REQUESTED',
                category: request.category,
                performedBy: adminUser,
                role: this.core.currentUserRole,
                note: instructions
            });
        }

        if (this.notifier) {
            this.notifier.dispatchStatusUpdate(request, 'REVISION_REQUESTED');
        }

        return { success: true, message: `Revision request sent to applicant.` };
    }
        }
