/**
 * Internal Admin Collaboration & Private Notes Thread
 * File: admin/features/approvals/modules/approval-comments.js
 */

export class ApprovalComments {
    constructor(storageKey = 'wishes_hub_approval_comments') {
        this.storageKey = storageKey;
        this.commentsStore = JSON.parse(localStorage.getItem(this.storageKey)) || {};
    }

    /**
     * Get All Comments for a Request
     */
    getComments(requestId) {
        return this.commentsStore[requestId] || [];
    }

    /**
     * Add Private Admin Comment
     */
    addComment(requestId, adminUser, commentText) {
        if (!commentText.trim()) return false;

        if (!this.commentsStore[requestId]) {
            this.commentsStore[requestId] = [];
        }

        const newComment = {
            id: `CMT-${Date.now()}`,
            author: adminUser,
            text: commentText.trim(),
            createdAt: new Date().toISOString()
        };

        this.commentsStore[requestId].push(newComment);
        this.saveState();
        return newComment;
    }

    /**
     * Save to Storage
     */
    saveState() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.commentsStore));
    }

    /**
     * Render Private Chat Thread HTML for Modal
     */
    renderCommentsHtml(requestId) {
        const comments = this.getComments(requestId);

        return `
            <div class="internal-comments-thread" style="margin-top: 15px; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">
                <h5 style="margin: 0 0 10px 0;">🔒 Private Internal Admin Thread (${comments.length})</h5>
                <div class="comments-list" style="max-height: 150px; overflow-y: auto; margin-bottom: 10px;">
                    ${comments.length === 0 ? '<p style="font-size: 12px; color: #94a3b8;">No internal notes added yet.</p>' : ''}
                    ${comments.map(c => `
                        <div class="comment-item" style="border-bottom: 1px solid rgba(255,255,255,0.1); padding: 6px 0;">
                            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #38bdf8;">
                                <strong>${c.author}</strong>
                                <span>${new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p style="margin: 3px 0 0 0; font-size: 13px;">${c.text}</p>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; gap: 8px;">
                    <input type="text" id="internal-comment-input" placeholder="Type internal note for team..." style="flex: 1; padding: 6px 10px; border-radius: 4px; border: 1px solid #334155; background: #0f172a; color: #fff; font-size: 12px;">
                    <button id="btn-add-internal-comment" data-id="${requestId}" style="background: #0284c7; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">Add Note</button>
                </div>
            </div>
        `;
    }
                                  }
