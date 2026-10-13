/**
 * Detailed Request Inspector Modal
 * File: admin/features/approvals/modules/approval-inspector.js
 */

import { APPROVAL_CONFIG } from '../approvals-config.js';

export class ApprovalInspector {
    constructor(approvalsCore, modalContainer) {
        this.core = approvalsCore;
        this.modalContainer = modalContainer;
    }

    /**
     * Inspect Request by ID
     */
    inspect(requestId, onActionCallback) {
        const request = this.core.getRequestById(requestId);
        if (!request) {
            alert('Security Notice: You do not have permission to view this request.');
            return;
        }

        this.renderModal(request);
        this.bindEvents(request, onActionCallback);
    }

    /**
     * Render Inspector Modal HTML
     */
    renderModal(request) {
        const badgeConfig = APPROVAL_CONFIG.BADGES[request.scope] || { bg: '#64748b', label: 'General' };
        const categoryConfig = APPROVAL_CONFIG.CATEGORIES[request.category] || { label: request.category };

        this.modalContainer.innerHTML = `
            <div class="approval-modal-backdrop">
                <div class="approval-modal-content">
                    <div class="approval-modal-header">
                        <span class="badge-scope" style="background-color: ${badgeConfig.bg}; color: #fff;">
                            ${badgeConfig.label}
                        </span>
                        <h3>Request Inspection: ${request.id}</h3>
                        <button class="btn-close-modal">&times;</button>
                    </div>

                    <div class="approval-modal-body">
                        <section class="inspector-section">
                            <h4>Overview</h4>
                            <p><strong>Title:</strong> ${request.title}</p>
                            <p><strong>Category:</strong> ${categoryConfig.label}</p>
                            <p><strong>Priority:</strong> ${request.priority}</p>
                            <p><strong>Status:</strong> <span class="status-tag status-${request.status.toLowerCase()}">${request.status}</span></p>
                        </section>

                        <section class="inspector-section">
                            <h4>Applicant / Requester Details</h4>
                            <p><strong>Name:</strong> ${request.applicant ? request.applicant.name : 'N/A'}</p>
                            <p><strong>Email:</strong> ${request.applicant ? request.applicant.email : 'N/A'}</p>
                            ${request.applicant?.socials ? `
                                <div class="social-links-grid">
                                    ${request.applicant.socials.telegram ? `<a href="${request.applicant.socials.telegram}" target="_blank" class="social-link">Telegram</a>` : ''}
                                    ${request.applicant.socials.github ? `<a href="${request.applicant.socials.github}" target="_blank" class="social-link">GitHub</a>` : ''}
                                    ${request.applicant.socials.linkedin ? `<a href="${request.applicant.socials.linkedin}" target="_blank" class="social-link">LinkedIn</a>` : ''}
                                </div>
                            ` : ''}
                        </section>

                        <section class="inspector-section">
                            <h4>Details & Description</h4>
                            <p class="inspector-text-block">${request.description}</p>
                        </section>

                        ${request.scope === APPROVAL_CONFIG.SCOPES.CUSTOM ? `
                            <div class="inspector-preview-trigger">
                                <button id="btn-launch-design-preview" class="btn-secondary" data-id="${request.id}">
                                    🎨 Launch Live Design Sandbox Preview
                                </button>
                            </div>
                        ` : ''}

                        <section class="inspector-section action-notes-section">
                            <h4>Decision Reasoning / Notes</h4>
                            <textarea id="approval-decision-note" placeholder="Write mandatory approval or rejection reason..."></textarea>
                        </section>
                    </div>

                    <div class="approval-modal-footer">
                        <button id="btn-modal-revision" class="btn-warning">Request Changes</button>
                        <button id="btn-modal-reject" class="btn-danger">Reject</button>
                        <button id="btn-modal-approve" class="btn-success">Approve Request</button>
                    </div>
                </div>
            </div>
        `;

        this.modalContainer.style.display = 'block';
    }

    /**
     * Bind Action Buttons
     */
    bindEvents(request, onActionCallback) {
        const closeBtn = this.modalContainer.querySelector('.btn-close-modal');
        const approveBtn = this.modalContainer.querySelector('#btn-modal-approve');
        const rejectBtn = this.modalContainer.querySelector('#btn-modal-reject');
        const revisionBtn = this.modalContainer.querySelector('#btn-modal-revision');
        const noteInput = this.modalContainer.querySelector('#approval-decision-note');

        const closeModal = () => {
            this.modalContainer.style.display = 'none';
            this.modalContainer.innerHTML = '';
        };

        closeBtn.onclick = closeModal;

        approveBtn.onclick = () => {
            const note = noteInput.value.trim();
            if (onActionCallback) onActionCallback('APPROVE', request.id, note);
            closeModal();
        };

        rejectBtn.onclick = () => {
            const note = noteInput.value.trim();
            if (!note) {
                alert('Please state a reason for rejection.');
                return;
            }
            if (onActionCallback) onActionCallback('REJECT', request.id, note);
            closeModal();
        };

        revisionBtn.onclick = () => {
            const note = noteInput.value.trim();
            if (!note) {
                alert('Please specify what changes are needed.');
                return;
            }
            if (onActionCallback) onActionCallback('REVISION', request.id, note);
            closeModal();
        };
    }
  }
