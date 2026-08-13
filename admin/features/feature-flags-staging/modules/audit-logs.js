/**
 * Sub-Module: Audit Logs & Governance
 * Path: admin/features/feature-flags-staging/modules/audit-logs.js
 */

export class AuditLogsModule {
  static render(container, flagsCoreInstance) {
    const logs = flagsCoreInstance.auditLogs;
    container.innerHTML = `
      <div class="audit-panel">
        <h4>Team Audit & Governance Trail (${logs.length})</h4>
        ${logs.length === 0 
          ? `<p style="color:#6e7681;">No audit actions recorded yet in this session.</p>`
          : `<ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:8px;">
              ${logs.map(log => `
                <li style="padding:10px; border:1px solid #e1e4e8; border-radius:6px; background:#fff; font-size:13px;">
                  <span style="color:#6e7681;">[${log.timestamp}]</span>
                  <strong style="color:#0366d6; margin:0 6px;">${log.action}</strong> 
                  (Flag: <code>${log.flagId}</code>) — ${log.details}
                </li>
              `).join('')}
             </ul>`
        }
      </div>
    `;
  }
}
