/**
 * Central Assembly Controller & UI Binder
 * File: admin/features/approvals/approvals-assembly.js
 */

import { ApprovalsCore } from './approvals-core.js';
import { APPROVAL_CONFIG } from './approvals-config.js';
import { ApprovalList } from './modules/approval-list.js';
import { ApprovalAction } from './modules/approval-action.js';
import { ApprovalInspector } from './modules/approval-inspector.js';
import { ApprovalDesignPreview } from './modules/approval-design-preview.js';
import { ApprovalAuditLog } from './modules/approval-audit-log.js';
import { ApprovalNotifier } from './modules/approval-notifier.js';
import { ApprovalComments } from './modules/approval-comments.js';

export class ApprovalsAssembly {
    constructor(rootContainerElement, currentUserRole = APPROVAL_CONFIG.ROLES.SUPER_ADMIN) {
        this.rootContainer = rootContainerElement;
        this.core = new ApprovalsCore(currentUserRole);
        this.auditLog = new ApprovalAuditLog();
        this.notifier = new ApprovalNotifier();
        this.actionEngine = new ApprovalAction(this.core, this.notifier, this.auditLog);
        this.commentsManager = new ApprovalComments();

        this.initDashboard();
    }

    /**
     * Initialize Dashboard Markup and Bind Event Listeners
     */
    initDashboard() {
        if (!this.rootContainer) return;

        this.rootContainer.innerHTML = `
            <div class="approvals-dashboard-wrapper">
                <div class="approvals-dashboard-header">
                    <h2>🛡️ Central Approval & Problem Management</h2>
                    <p>Role Active: <strong>${this.core.currentUserRole}</strong> | Governing site-wide admins, heavy custom designs, and user requests.</p>
                </div>

                <div class="approvals-toolbar">
                    <div class="filter-group">
                        <label>Scope Filter:</label>
                        <select id="scope-filter-select">
                            <option value="ALL">All Scopes</option>
                            <option value="ADMIN_SCOPE">Admin Scope (🔒)</option>
                            <option value="CUSTOM_SCOPE">Heavy Design Scope (🎨)</option>
                            <option value="USER_SCOPE">User Scope (👤)</option>
                        </select>
                    </div>
                </div>

                <div id="approvals-queue-container" class="approvals-queue-grid"></div>
            </div>

            <!-- Global Inspector Modal Container -->
            <div id="approval-inspector-modal" class="approval-modal-overlay" style="display: none;"></div>
            <!-- Live Sandbox Preview Container -->
            <div id="design-sandbox-container" class="design-sandbox-overlay" style="display: none;"></div>
        `;

        // Bind Sub-components
        const queueEl = this.rootContainer.querySelector('#approvals-queue-container');
        const modalEl = this.rootContainer.querySelector('#approval-inspector-modal');
        const sandboxEl = this.rootContainer.querySelector('#design-sandbox-container');

        this.listModule = new ApprovalList(this.core, queueEl);
        this.inspectorModule = new ApprovalInspector(this.core, modalEl);
        this.previewModule = new ApprovalDesignPreview(sandboxEl);

        this.listModule.render();
        this.bindGlobalEvents();
    }

    /**
     * Bind UI Interaction Events
     */
    bindGlobalEvents() {
        // Scope Filter Change
        const scopeSelect = this.rootContainer.querySelector('#scope-filter-select');
        scopeSelect.onchange = (e) => {
            this.listModule.setScopeFilter(e.target.value);
        };

        // Queue Card Inspect Trigger
        this.rootContainer.onclick = (e) => {
            const inspectBtn = e.target.closest('.btn-inspect-req');
            if (inspectBtn) {
                const reqId = inspectBtn.getAttribute('data-id');
                this.inspectorModule.inspect(reqId, (actionType, id, note) => {
                    this.handleDecisionAction(actionType, id, note);
                });
            }

            const previewBtn = e.target.closest('#btn-launch-design-preview');
            if (previewBtn) {
                const reqId = previewBtn.getAttribute('data-id');
                const req = this.core.getRequestById(reqId);
                if (req) this.previewModule.openPreview(req);
            }
        };
    }

    /**
     * Handle Inspector Decision Callbacks
     */
    handleDecisionAction(actionType, requestId, note) {
        const adminUser = `Admin_${this.core.currentUserRole}`;
        let result = { success: false };

        if (actionType === 'APPROVE') {
            result = this.actionEngine.approveRequest(requestId, adminUser, note);
        } else if (actionType === 'REJECT') {
            result = this.actionEngine.rejectRequest(requestId, adminUser, note);
        } else if (actionType === 'REVISION') {
            result = this.actionEngine.requestRevision(requestId, adminUser, note);
        }

        if (result.success) {
            alert(result.message);
            this.listModule.render();
        } else {
            alert(`Error: ${result.message}`);
        }
    }
                                                     }
