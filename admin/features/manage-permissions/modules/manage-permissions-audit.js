/**
 * Manage Permissions - Audit Logs Sub-Module
 * Renders the historical security and permission change activity log.
 */

import { permissionCore } from '../manage-permissions-core.js';

export class PermissionAuditModule {
    constructor(containerElement) {
        this.container = containerElement;
    }

    render() {
        const logs = permissionCore.state.auditLogs || [];

        let html = `
            <div class="audit-panel">
                <h3>Security & Permission Audit Logs</h3>
                <div class="table-responsive">
                    <table class="audit-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Admin ID</th>
                                <th>Action Type</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        if (logs.length === 0) {
            html += `<tr><td colspan="4" class="text-center">No audit logs recorded yet.</td></tr>`;
        } else {
            logs.forEach(log => {
                html += `
                    <tr>
                        <td>${new Date(log.timestamp).toLocaleString()}</td>
                        <td><code>${log.adminId}</code></td>
                        <td><span class="badge">${log.action}</span></td>
                        <td>${log.details}</td>
                    </tr>
                `;
            });
        }

        html += `</tbody></table></div></div>`;
        this.container.innerHTML = html;
    }
}
