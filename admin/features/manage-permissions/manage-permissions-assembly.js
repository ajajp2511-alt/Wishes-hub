/**
 * Manage Permissions - Assembly (Complete Integration)
 * Binds all sub-modules (Matrix, Roles, Users, Audit) to the dashboard tabs.
 */

import { permissionCore } from './manage-permissions-core.js';
import { ManageRolesModule } from './modules/manage-permissions-roles.js';
import { PermissionMatrixModule } from './modules/manage-permissions-matrix.js';
import { ManageUsersModule } from './modules/manage-permissions-users.js';
import { PermissionAuditModule } from './modules/manage-permissions-audit.js';

export class ManagePermissionsAssembly {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    init() {
        if (!this.container) {
            console.error('Permission module container not found!');
            return;
        }

        this.renderLayout();
        this.loadTabContent('matrix'); // Default tab
        this.attachEventListeners();
    }

    renderLayout() {
        this.container.innerHTML = `
            <div class="permission-dashboard">
                <h2>🔐 Advanced Access Control & Permissions</h2>
                <div class="permission-tabs">
                    <button class="tab-btn active" data-tab="matrix">Permission Matrix</button>
                    <button class="tab-btn" data-tab="roles">Manage Roles</button>
                    <button class="tab-btn" data-tab="users">User Assignments</button>
                    <button class="tab-btn" data-tab="audit">Audit Logs</button>
                </div>
                <div class="permission-tab-content" id="permissionTabContent"></div>
            </div>
        `;
    }

    loadTabContent(tabName) {
        const contentContainer = document.getElementById('permissionTabContent');
        if (!contentContainer) return;

        contentContainer.innerHTML = ''; // Clear previous

        switch (tabName) {
            case 'matrix':
                new PermissionMatrixModule(contentContainer).render();
                break;
            case 'roles':
                new ManageRolesModule(contentContainer).render();
                break;
            case 'users':
                new ManageUsersModule(contentContainer).render();
                break;
            case 'audit':
                new PermissionAuditModule(contentContainer).render();
                break;
            default:
                contentContainer.innerHTML = `<p>Select a valid tab.</p>`;
        }
    }

    attachEventListeners() {
        const tabs = this.container.querySelectorAll('.tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                const tabName = e.target.getAttribute('data-tab');
                this.loadTabContent(tabName);
            });
        });
    }
        }
