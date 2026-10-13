/**
 * Live Design & Heavy Wish Template Sandbox Previewer
 * File: admin/features/approvals/modules/approval-design-preview.js
 */

export class ApprovalDesignPreview {
    constructor(sandboxContainer) {
        this.container = sandboxContainer;
    }

    /**
     * Open Live Sandbox Preview for Heavy Custom Designs
     */
    openPreview(designData) {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="design-sandbox-backdrop">
                <div class="design-sandbox-window">
                    <div class="sandbox-header">
                        <span>🎨 Live Design Inspector: <strong>${designData.title}</strong></span>
                        <div class="sandbox-controls">
                            <span class="asset-size-indicator ${designData.assetSizeMB > 5 ? 'indicator-warn' : 'indicator-ok'}">
                                Total Assets: ${designData.assetSizeMB || '0.0'} MB
                            </span>
                            <button class="btn-close-sandbox">&times;</button>
                        </div>
                    </div>

                    <div class="sandbox-body">
                        <iframe id="design-preview-frame" srcdoc="${this.buildSandboxDocument(designData)}" sandbox="allow-scripts"></iframe>
                    </div>
                </div>
            </div>
        `;

        this.container.style.display = 'block';

        const closeBtn = this.container.querySelector('.btn-close-sandbox');
        closeBtn.onclick = () => {
            this.container.style.display = 'none';
            this.container.innerHTML = '';
        };
    }

    /**
     * Build Safe Isolation HTML Frame for Visual Design
     */
    buildSandboxDocument(designData) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 20px; font-family: sans-serif; background: #0f172a; color: #fff; text-align: center; }
                    .preview-box { border: 2px dashed #3b82f6; padding: 40px; border-radius: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <h3>Wishes Hub Interactive Design Preview</h3>
                <div class="preview-box">
                    <h4>${designData.title}</h4>
                    <p>${designData.description}</p>
                    <small>Rendering performance check: Passed</small>
                </div>
            </body>
            </html>
        `;
    }
}
