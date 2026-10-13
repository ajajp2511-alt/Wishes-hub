/**
 * Dual-Scope Request Queue & List Renderer
 * File: admin/features/approvals/modules/approval-list.js
 */

import { APPROVAL_CONFIG } from '../approvals-config.js';

export class ApprovalList {
    constructor(approvalsCore, containerElement) {
        this.core = approvalsCore;
        this.container = containerElement;
        this.activeScopeFilter = 'ALL';
        this.activePriorityFilter = 'ALL';
    }

    /**
     * Set active scope filter (ADMIN_SCOPE, CUSTOM_SCOPE, USER_SCOPE, or ALL)
     */
    setScopeFilter(scope) {
        this.activeScopeFilter = scope;
        this.render();
    }

    /**
     * Set active priority filter (P0, P1, P2, or ALL)
     */
    setPriorityFilter(priority) {
        this.activePriorityFilter = priority;
        this.render();
    }

    /**
     * Render Queue Cards
     */
    render() {
        if (!this.container) return;

        const requests = this.core.getVisibleRequests(
            this.activeScopeFilter,
            this.activePriorityFilter
        );

        if (requests.length === 0) {
            this.container.innerHTML = `
                <div class="approval-empty-state">
                    <h3>No Pending Approvals</h3>
                    <p>There are no requests matching your access level or selected filter.</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = requests.map(req => this.buildCardHtml(req)).join('');
    }

    /**
     * Build individual card HTML with badges and metadata
     */
    buildCardHtml(req) {
        const badgeConfig = APPROVAL_CONFIG.BADGES[req.scope] || { bg: '#64748b', text: '#fff', label: 'General' };
        const categoryInfo = APPROVAL_CONFIG.CATEGORIES[req.category] || { label: req.category };
        const isSuperAdminOnly = categoryInfo.minRoleRequired === APPROVAL_CONFIG.ROLES.SUPER_ADMIN;

        return `
            <div class="approval-card" data-id="${req.id}" data-priority="${req.priority}">
                <div class="approval-card-header">
                    <div class="approval-badges">
                        <span class="badge-scope" style="background-color: ${badgeConfig.bg}; color: ${badgeConfig.text};">
                            ${badgeConfig.label}
                        </span>
                        <span class="badge-priority badge-priority-${req.priority.toLowerCase()}">
                            ${req.priority}
                        </span>
                        ${isSuperAdminOnly ? `<span class="badge-superadmin-lock">🔒 Super Admin Only</span>` : ''}
                    </div>
                    <span class="approval-timestamp">${new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div class="approval-card-body">
                    <h4 class="approval-title">${req.title}</h4>
                    <p class="approval-category"><strong>Category:</strong> ${categoryInfo.label}</p>
                    <p class="approval-description">${req.description}</p>
                    ${req.assetSizeMB ? `<p class="approval-asset-warning ${req.assetSizeMB > 5 ? 'size-alert' : ''}">📦 Asset Size: ${req.assetSizeMB} MB</p>` : ''}
                </div>

                <div class="approval-card-footer">
                    <span class="approval-applicant">Submitted by: <strong>${req.applicant ? req.applicant.name : 'Unknown'}</strong></span>
                    <button class="btn-inspect-req" data-id="${req.id}">Inspect & Review →</button>
                </div>
            </div>
        `;
    }
}
