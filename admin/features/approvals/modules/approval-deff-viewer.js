/**
 * Side-by-Side Version Diff Comparison Tool
 * File: admin/features/approvals/modules/approval-diff-viewer.js
 */

export class ApprovalDiffViewer {
    constructor(containerElement) {
        this.container = containerElement;
    }

    /**
     * Render Version Comparison
     */
    renderDiff(oldVersionData, newVersionData) {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="diff-viewer-wrapper">
                <div class="diff-header">
                    <h4>Visual Diff Inspector: Template Modifications</h4>
                </div>
                <div class="diff-grid">
                    <div class="diff-panel diff-old">
                        <h5>Previously Approved Version</h5>
                        <pre>${JSON.stringify(oldVersionData || { note: 'No prior version' }, null, 2)}</pre>
                    </div>
                    <div class="diff-panel diff-new">
                        <h5>Newly Submitted Version</h5>
                        <pre>${JSON.stringify(newVersionData, null, 2)}</pre>
                    </div>
                </div>
            </div>
        `;
    }
}
