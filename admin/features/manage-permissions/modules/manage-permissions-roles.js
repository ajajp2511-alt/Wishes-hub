/**
 * Manage Permissions - Roles Sub-Module
 * Handles rendering role management UI, creating custom roles, and editing descriptions.
 */

import { permissionCore } from '../manage-permissions-core.js';

export class ManageRolesModule {
    constructor(containerElement) {
        this.container = containerElement;
    }

    render() {
        const roles = permissionCore.state.roles;
        
        let html = `
            <div class="roles-management-panel">
                <h3>System & Custom Roles</h3>
                <div class="role-creation-form">
                    <input type="text" id="newRoleId" placeholder="Role ID (e.g. manager)">
                    <input type="text" id="newRoleName" placeholder="Role Display Name">
                    <input type="text" id="newRoleDesc" placeholder="Description">
                    <button id="createRoleBtn" class="btn-primary">Add Role</button>
                </div>
                <div class="roles-list-grid">
        `;

        for (const key in roles) {
            const role = roles[key];
            html += `
                <div class="role-card">
                    <h4>${role.name} <code>(${role.id})</code></h4>
                    <p>${role.description}</p>
                </div>
            `;
        }

        html += `</div></div>`;
        this.container.innerHTML = html;
        this.attachEvents();
    }

    attachEvents() {
        const btn = document.getElementById('createRoleBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                const id = document.getElementById('newRoleId').value.trim().toLowerCase();
                const name = document.getElementById('newRoleName').value.trim();
                const description = document.getElementById('newRoleDesc').value.trim();

                if (!id || !name) {
                    alert('Role ID and Name are required!');
                    return;
                }

                permissionCore.state.roles[id] = { id, name, description };
                permissionCore.saveState();
                permissionCore.logAudit('current_admin', 'CREATE_ROLE', `Created new role: ${name}`);
                this.render();
                alert('Role created successfully!');
            });
        }
    }
}
