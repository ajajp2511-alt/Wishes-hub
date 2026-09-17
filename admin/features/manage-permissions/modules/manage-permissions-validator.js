/**
 * Manage Permissions - Validator Sub-Module
 * Provides route guards and UI element access verification helpers.
 */

import { permissionCore } from '../manage-permissions-core.js';

export class PermissionValidator {
    static guard(userId, moduleName, action) {
        const allowed = permissionCore.hasPermission(userId, moduleName, action);
        if (!allowed) {
            console.warn(`Access Denied for user ${userId} on [${moduleName} : ${action}]`);
            return false;
        }
        return true;
    }

    static applyUIConstraints(userId) {
        document.querySelectorAll('[data-permission-module]').forEach(el => {
            const moduleName = el.getAttribute('data-permission-module');
            const action = el.getAttribute('data-permission-action') || 'read';

            if (!permissionCore.hasPermission(userId, moduleName, action)) {
                el.style.display = 'none'; // Hide restricted buttons/elements
            }
        });
    }
}
