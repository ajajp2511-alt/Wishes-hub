/**
 * Manage Permissions - Matrix Sub-Module
 * Renders the interactive module vs action matrix grid with checkboxes.
 */

import { permissionCore } from '../manage-permissions-core.js';
import { PERMISSION_ACTIONS } from '../manage-permissions-config.js';

export class PermissionMatrixModule {
    constructor(containerElement) {
        this.container = containerElement;
        this.modulesList = ['dashboard', 'wishes', 'categories', 'settings', 'permissions'];
    }

    render() {
        const roles = permissionCore.state.roles;
        const matrix = permissionCore.state.matrix;

        let html = `
            <div class="matrix-panel">
                <h3>Permission Matrix Grid</h3>
                <div class="table-responsive">
                    <table class="permission-table">
                        <thead>
                            <tr>
                                <th>Module / Action</th>
        `;

        for (const rKey in roles) {
            html += `<th>${roles[rKey].name}</th>`;
        }

        html += `</tr></thead><tbody>`;

        this.modulesList.forEach(mod => {
            Object.values(PERMISSION_ACTIONS).forEach(action => {
                html += `<tr><td><strong>${mod}</strong> : ${action}</td>`;
                
                for (const rKey in roles) {
                    const roleId = roles[rKey].id;
                    const isChecked = matrix[roleId]?.[mod]?.includes(action) ? 'checked' : '';
                    const isDisabled = roleId === 'super_admin' ? 'disabled' : '';

                    html += `<td>
                        <input type="checkbox" class="perm-checkbox" 
                            data-role="${roleId}" data-module="${mod}" data-action="${action}" 
                            ${isChecked} ${isDisabled}>
                    </td>`;
                }
                html += `</tr>`;
            });
        });

        html += `</tbody></table></div></div>`;
        this.container.innerHTML = html;
        this.attachEvents();
    }

    attachEvents() {
        this.container.querySelectorAll('.perm-checkbox').forEach(box => {
            box.addEventListener('change', (e) => {
                const { role, module, action } = e.target.dataset;
                const isChecked = e.target.checked;

                if (!permissionCore.state.matrix[role]) {
                    permissionCore.state.matrix[role] = {};
                }
                if (!permissionCore.state.matrix[role][module]) {
                    permissionCore.state.matrix[role][module] = [];
                }

                if (isChecked) {
                    if (!permissionCore.state.matrix[role][module].includes(action)) {
                        permissionCore.state.matrix[role][module].push(action);
                    }
                } else {
                    permissionCore.state.matrix[role][module] = permissionCore.state.matrix[role][module].filter(a => a !== action);
                }

                permissionCore.saveState();
                permissionCore.logAudit('current_admin', 'UPDATE_MATRIX', `Updated ${action} for ${module} on role ${role}`);
            });
        });
    }
}
