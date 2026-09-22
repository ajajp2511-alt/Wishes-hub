export class BrandingUI {
    constructor(core) {
        this.core = core;
    }

    init(container) {
        window.handleVisibilityToggle = (placementId) => {
            const success = this.core.togglePlacement(placementId);
            if (success) {
                this.render();
            }
        };

        if (container) {
            container.innerHTML = `
                <div class="branding-wrapper" style="padding: 16px; max-width: 800px; margin: 0 auto; color: #1e293b;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
                        <h2 style="font-size: 18px; font-weight: bold; margin: 0;">Logo & Branding Manager</h2>
                        <span style="font-size: 11px; background: #e0e7ff; color: #3730a3; padding: 4px 8px; border-radius: 4px; font-weight: 600;">Active Studio Ecosystem</span>
                    </div>
                    
                    <div id="aiBrandingAuditContainer" style="margin-bottom: 16px;"></div>
                    
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <h3 style="font-size: 14px; font-weight: bold; color: #334155; margin-bottom: 12px;">Placement Visibility Control</h3>
                        <div id="brandingPlacementsContainer"></div>
                    </div>
                    
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <h3 style="font-size: 14px; font-weight: bold; color: #334155; margin-bottom: 12px;">Audit Logs & History</h3>
                        <div id="brandingLogsContainer"></div>
                    </div>
                </div>
            `;
        }

        this.render();
    }

    render() {
        this.renderAiAuditSummary();
        this.renderPlacementsTable();
        this.renderBrandingLogs();
    }

    renderAiAuditSummary() {
        const container = document.getElementById('aiBrandingAuditContainer');
        if (!container) return;

        const audit = this.core.runAiBrandAudit();
        container.innerHTML = `
            <div class="branding-card-gradient" style="border-radius: 8px; padding: 14px; color: #ffffff;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">AI Brand Guidelines & Accessibility Auditor</span>
                    <span style="background: #10b981; color: #ffffff; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${audit.wcagScore}</span>
                </div>
                <p style="font-size: 12px; margin: 0; color: #cbd5e1;">Extracted Palette: <strong style="font-family: monospace; color: #ffffff;">${audit.palette.join(', ')}</strong> • Watermark Security: ${audit.cryptoWatermarkStatus}</p>
            </div>
        `;
    }

    renderPlacementsTable() {
        const container = document.getElementById('brandingPlacementsContainer');
        if (!container) return;

        container.innerHTML = '';
        const placements = this.core.getPlacements();

        placements.forEach(p => {
            let badgeBg = p.enabled ? '#d1fae5' : '#f1f5f9';
            let badgeColor = p.enabled ? '#065f46' : '#475569';
            let btnBg = p.enabled ? '#e11d48' : '#059669';
            let btnText = p.enabled ? 'Turn OFF' : 'Turn ON';

            container.innerHTML += `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="font-size: 13px; font-weight: bold; color: #1e293b;">${p.name}</span>
                            <span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; background: ${badgeBg}; color: ${badgeColor};">${p.enabled ? 'VISIBLE (ON)' : 'HIDDEN (OFF)'}</span>
                        </div>
                        <p style="font-size: 11px; color: #64748b; margin: 0;">Category: <strong style="color: #4f46e5;">${p.category}</strong></p>
                    </div>
                    <div>
                        <button onclick="window.handleVisibilityToggle('${p.id}')" style="font-size: 11px; color: #ffffff; background: ${btnBg}; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer;">
                            ${btnText}
                        </button>
                    </div>
                </div>
            `;
        });
    }

    renderBrandingLogs() {
        const container = document.getElementById('brandingLogsContainer');
        if (!container) return;

        container.innerHTML = '';
        this.core.brandingLogs.forEach(log => {
            container.innerHTML += `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="font-size: 12px; font-weight: bold; color: #334155;">${log.action}</span>
                        <p style="font-size: 10px; color: #94a3b8; margin: 2px 0 0 0;">${log.timestamp} • Status: ${log.status}</p>
                    </div>
                </div>
            `;
        });
    }
}
