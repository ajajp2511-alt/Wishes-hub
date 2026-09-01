/**
 * Sub-Module: Audit Logs & Governance
 * Path: admin/features/feature-flags-staging/modules/audit-logs.js
 */

export class AuditLogsModule {
  static render(container, flagsCoreInstance) {
    if (!container) return;

    const logs = flagsCoreInstance?.getAuditLogs 
      ? flagsCoreInstance.getAuditLogs() 
      : (flagsCoreInstance?.auditLogs || []);

    container.innerHTML = `
      <div class="push-registry-panel">
        <div class="card-top-row" style="margin-bottom: 1rem;">
          <h3 class="flags-section-title" style="margin: 0;">
            Team Audit & Governance Trail (${logs.length})
          </h3>
          ${logs.length > 0 ? `<button id="btn-clear-logs" class="circuit-breaker-btn">Clear Logs</button>` : ''}
        </div>

        ${logs.length === 0 
          ? `<div class="security-empty">No audit actions recorded yet in this session.</div>`
          : `<ul class="token-list">
              ${logs.map(log => `
                <li class="token-item" style="flex-direction: column; align-items: flex-start; gap: 0.25rem;">
                  <div style="display: flex; gap: 0.5rem; align-items: center; width: 100%; justify-content: space-between;">
                    <strong style="color: #2563eb; font-size: 0.85rem;">${log.action || 'ACTION'}</strong>
                    <span style="color: #6b7280; font-size: 0.75rem;">${log.timestamp || ''}</span>
                  </div>
                  <div style="font-size: 0.825rem; color: #374151;">
                    Flag: <code>${log.flagId || 'SYSTEM'}</code> — ${log.details || 'No details'}
                  </div>
                </li>
              `).join('')}
             </ul>`
        }
      </div>
    `;

    container.querySelector('#btn-clear-logs')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all audit logs?')) {
        if (flagsCoreInstance) flagsCoreInstance.auditLogs = [];
        if (flagsCoreInstance?.persistLogs) flagsCoreInstance.persistLogs();
        this.render(container, flagsCoreInstance);
      }
    });
  }
}
