/**
 * Manage Permissions - Users Assignment Sub-Module
 * Interface to assign specific roles to individual users.
 */

import { permissionCore } from '../manage-permissions-core.js';

export class ManageUsersModule {
    constructor(containerElement) {
        this.container = containerElement;
    }

    render() {
        const roles = permissionCore.state.roles;
        const userRoles = permissionCore.state.userRoles;

        let html = `
            <div class="users-assignment-panel">
                <h3>Assign Roles to Users</h3>
                <div class="assignment-form">
                    <input type="text" id="targetUserId" placeholder="Enter User ID">
                    <select id="roleSelectDropdown">
                        <option value="">-- Select Role --</option>
        `;

        for (const key in roles) {
            html += `<option value="${roles[key].id}">${roles[key].name}</option>`;
        }

        html += `
                    </select>
                    <button id="assignRoleBtn" class="btn-primary">Assign Role</button>
                </div>
                
                <h4>Current Assignments</h4>
                <table class="user-roles-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Assigned Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        for (const userId in userRoles) {
            html += `
                <tr>
                    <td><code>${userId}</code></td>
                    <td><span class="badge role-badge">${roles[userRoles[userId]]?.name || 'Unknown'}</span></td>
                    <td><button class="btn-danger btn-sm remove-role-btn" data-userid="${userId}">Revoke</button></td>
                </tr>
            `;
        }

        html += `</tbody></table></div>`;
        this.container.innerHTML = html;
        this.attachEvents();
    }

    attachEvents() {
        const assignBtn = document.getElementById('assignRoleBtn');
        if (assignBtn) {
            assignBtn.addEventListener('click', () => {
                const userId = document.getElementById('targetUserId').value.trim();
                const roleId = document.getElementById('roleSelectDropdown').value;

                if (!userId || !roleId) {
                    alert('Please enter a User ID and select a Role.');
                    return;
                }

                permissionCore.assignRoleToUser(userId, roleId, 'current_admin');
                this.render();
                alert('Role assigned successfully!');
            });
        }

        this.container.querySelectorAll('.remove-role-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.dataset.userid;
                if (confirm(`Are you sure you want to revoke access for ${userId}?`)) {
                    delete permissionCore.state.userRoles[userId];
                    permissionCore.logAudit('current_admin', 'REVOKE_ROLE', `Revoked role from user ${userId}`);
                    permissionCore.saveState();
                    this.render();
                }
            });
        });
    }
}
