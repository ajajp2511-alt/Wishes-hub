/**
 * Manage Permissions - Core Logic
 * Handles permission storage, evaluation, and database interactions.
 */

import { PERMISSION_CONFIG, SYSTEM_ROLES } from './manage-permissions-config.js';

class PermissionCore {
    constructor() {
        this.storageKey = 'wishes_hub_permissions_v1';
        this.state = this.loadState();
    }

    loadState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load permissions from storage', e);
        }

        // Default initial state
        return {
            roles: SYSTEM_ROLES,
            userRoles: {}, // userId -> roleId
            matrix: {},    // roleId -> { moduleName: [actions] }
            auditLogs: []
        };
    }

    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
            return true;
        } catch (e) {
            console.error('Failed to save permissions state', e);
            return false;
        }
    }

    hasPermission(userId, moduleName, action) {
        const roleId = this.state.userRoles[userId];
        if (!roleId) return false;

        if (roleId === 'super_admin') return true;

        const rolePermissions = this.state.matrix[roleId];
        if (!rolePermissions || !rolePermissions[moduleName]) return false;

        return rolePermissions[moduleName].includes(action);
    }

    assignRoleToUser(userId, roleId, adminId) {
        this.state.userRoles[userId] = roleId;
        this.logAudit(adminId, 'ASSIGN_ROLE', `Assigned role ${roleId} to user ${userId}`);
        this.saveState();
    }

    logAudit(adminId, action, details) {
        const logEntry = {
            id: 'audit_' + Date.now(),
            adminId,
            action,
            details,
            timestamp: new Date().toISOString()
        };
        this.state.auditLogs.unshift(logEntry);
        if (this.state.auditLogs.length > 100) {
            this.state.auditLogs.pop();
        }
    }
}

export const permissionCore = new PermissionCore();
