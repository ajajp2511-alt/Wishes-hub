/**
 * Manage Permissions - Granularity Sub-Module
 * Handles field-level and action-level sub-rights (e.g. Publish, Export, Special Approvals).
 */

import { permissionCore } from '../manage-permissions-core.js';

export class PermissionGranularity {
    static checkGranularRight(userId, moduleName, specificAction, resourceOwnerId) {
        // Base check
        if (!permissionCore.hasPermission(userId, moduleName, specificAction)) {
            // Check if user is the resource owner and has ownership privileges
            if (userId === resourceOwnerId) {
                return true; 
            }
            return false;
        }
        return true;
    }
}
