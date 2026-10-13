/**
 * Mobile Load Speed & Asset Size Performance Analyzer
 * File: admin/features/approvals/modules/approval-performance-check.js
 */

import { APPROVAL_CONFIG } from '../approvals-config.js';

export class ApprovalPerformanceCheck {
    /**
     * Analyze Design Request Assets for Mobile Optimization
     */
    static analyze(requestData) {
        const categoryConfig = APPROVAL_CONFIG.CATEGORIES[requestData.category];
        const thresholdMB = categoryConfig?.maxAssetSizeMB || 5.0;
        const assetSizeMB = requestData.assetSizeMB || 0;

        const isOverSize = assetSizeMB > thresholdMB;
        const estimated3GTimeSec = ((assetSizeMB * 8) / 1.5).toFixed(1); // Estimated load on 1.5 Mbps network

        return {
            passed: !isOverSize,
            assetSizeMB,
            thresholdMB,
            estimated3GTimeSec,
            warning: isOverSize ? `Asset payload (${assetSizeMB}MB) exceeds mobile threshold (${thresholdMB}MB). May cause latency on slower connections.` : null,
            score: isOverSize ? 'POOR' : assetSizeMB > (thresholdMB * 0.7) ? 'MODERATE' : 'OPTIMAL'
        };
    }

    /**
     * Generate HTML Badge Report for Inspector
     */
    static renderPerformanceBadgeHtml(requestData) {
        const report = this.analyze(requestData);
        const badgeColor = report.score === 'OPTIMAL' ? '#059669' : report.score === 'MODERATE' ? '#d97706' : '#dc2626';

        return `
            <div class="perf-report-card" style="border-left: 4px solid ${badgeColor}; padding: 10px; margin-top: 10px; background: rgba(255,255,255,0.05); border-radius: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>📱 Mobile Network Impact:</strong>
                    <span style="background: ${badgeColor}; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                        ${report.score}
                    </span>
                </div>
                <p style="margin: 5px 0 0 0; font-size: 13px;">
                    Payload: <strong>${report.assetSizeMB} MB</strong> (Max Allowed: ${report.thresholdMB} MB) | Est. 3G Load Time: <strong>~${report.estimated3GTimeSec}s</strong>
                </p>
                ${report.warning ? `<p style="color: #ef4444; margin: 4px 0 0 0; font-size: 12px;">⚠️ ${report.warning}</p>` : ''}
            </div>
        `;
    }
}
