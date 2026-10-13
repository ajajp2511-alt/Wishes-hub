/**
 * Master Approvals State, Queue & Access Visibility Controller
 * File: admin/features/approvals/approvals-core.js
 */

import { APPROVAL_CONFIG } from './approvals-config.js';

export class ApprovalsCore {
    constructor(currentUserRole = APPROVAL_CONFIG.ROLES.SUB_ADMIN) {
        this.currentUserRole = currentUserRole;
        this.queue = [];
        this.auditLogs = [];
        this.initCoreState();
    }

    /**
     * Initialize State and Load Queue from Local Storage or API
     */
    initCoreState() {
        const storedQueue = localStorage.getItem(APPROVAL_CONFIG.STORAGE_KEYS.QUEUE);
        const storedLogs = localStorage.getItem(APPROVAL_CONFIG.STORAGE_KEYS.AUDIT_LOG);

        this.queue = storedQueue ? JSON.parse(storedQueue) : this.getInitialMockData();
        this.auditLogs = storedLogs ? JSON.parse(storedLogs) : [];
        this.saveState();
    }

    /**
     * Save current state to local storage
     */
    saveState() {
        localStorage.setItem(APPROVAL_CONFIG.STORAGE_KEYS.QUEUE, JSON.stringify(this.queue));
        localStorage.setItem(APPROVAL_CONFIG.STORAGE_KEYS.AUDIT_LOG, JSON.stringify(this.auditLogs));
    }

    /**
     * Role Hierarchy Gatekeeper
     * Enforces Sub-Admins cannot see or manage Super Admin level requests.
     */
    canViewRequest(request) {
        if (this.currentUserRole === APPROVAL_CONFIG.ROLES.SUPER_ADMIN) {
            return true; // Super Admin sees everything across the site
        }

        // Sub-Admins cannot see Admin Scope requests or Super-Admin locked tasks
        const categoryConfig = APPROVAL_CONFIG.CATEGORIES[request.category];
        if (!categoryConfig) return false;

        if (categoryConfig.minRoleRequired === APPROVAL_CONFIG.ROLES.SUPER_ADMIN) {
            return false;
        }

        return request.scope !== APPROVAL_CONFIG.SCOPES.ADMIN;
    }

    /**
     * Get Filtered Request Queue based on current Admin Role & Scope Filter
     */
    getVisibleRequests(scopeFilter = 'ALL', priorityFilter = 'ALL') {
        return this.queue.filter(request => {
            // Visibility hierarchy check
            if (!this.canViewRequest(request)) return false;

            // Scope filter check
            if (scopeFilter !== 'ALL' && request.scope !== scopeFilter) return false;

            // Priority filter check
            if (priorityFilter !== 'ALL' && request.priority !== priorityFilter) return false;

            return true;
        });
    }

    /**
     * Fetch Single Request Details with Security Enforcement
     */
    getRequestById(requestId) {
        const request = this.queue.find(item => item.id === requestId);
        if (!request) return null;

        if (!this.canViewRequest(request)) {
            console.error(`[Security Guard]: Role ${this.currentUserRole} is unauthorized to inspect Request ID ${requestId}`);
            return null;
        }

        return request;
    }

    /**
     * Add New Request to Queue
     */
    addRequest(requestData) {
        const newRequest = {
            id: `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            createdAt: new Date().toISOString(),
            status: APPROVAL_CONFIG.STATUS.PENDING,
            ...requestData
        };

        this.queue.unshift(newRequest);
        this.saveState();
        return newRequest;
    }

    /**
     * Internal Mock Data Generator for Fresh Systems
     */
    getInitialMockData() {
        return [
            {
                id: 'REQ-1001',
                scope: APPROVAL_CONFIG.SCOPES.ADMIN,
                category: 'ADMIN_SIGN_IN',
                priority: 'P0',
                title: 'New Admin Sign-In: Rohan Mehta',
                description: 'Requested access for Admin Panel. Included Telegram and GitHub links in cover note.',
                applicant: { name: 'Rohan Mehta', email: 'rohan@patelstudio.com' },
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                status: APPROVAL_CONFIG.STATUS.PENDING
            },
            {
                id: 'REQ-1002',
                scope: APPROVAL_CONFIG.SCOPES.CUSTOM,
                category: 'HEAVY_DESIGN_TEMPLATE',
                priority: 'P1',
                title: '3D Diwali Wishes Animated Canvas',
                description: 'Heavy 3D particles template with custom audio player.',
                applicant: { name: 'Design Team', email: 'design@wisheshub.com' },
                assetSizeMB: 6.2,
                createdAt: new Date(Date.now() - 7200000).toISOString(),
                status: APPROVAL_CONFIG.STATUS.PENDING
            },
            {
                id: 'REQ-1003',
                scope: APPROVAL_CONFIG.SCOPES.USER,
                category: 'USER_CONTENT_REPORT',
                priority: 'P0',
                title: 'Reported Abusive Custom Wish Link',
                description: 'User reported illegal text in wish ID #8892.',
                applicant: { name: 'Anonymous User', email: 'support@wisheshub.com' },
                createdAt: new Date(Date.now() - 1800000).toISOString(),
                status: APPROVAL_CONFIG.STATUS.PENDING
            }
        ];
    }
}
