/**
 * Manage Permissions - Bulk Updates Sub-Module
 * Allows assigning or revoking roles for multiple users at once via CSV/Array.
 */

import { permissionCore } from '../manage-permissions-core.js';

export class PermissionBulkModule {
    static processBulkAssignment(userIdsArray, roleId, adminId) {
        if (!Array.isArray(userIdsArray) || userIdsArray.length === 0) {
            console.error('Invalid user array provided for bulk assignment.');
            return false;
        }

        if (!permissionCore.state.roles[roleId]) {
            console.error('Invalid Role ID provided.');
            return false;
        }

        let successCount = 0;
        userIdsArray.forEach(userId => {
            if (userId) {
                permissionCore.state.userRoles[userId.trim()] = roleId;
                successCount++;
            }
        });

        permissionCore.logAudit(adminId, 'BULK_ASSIGN', `Assigned role ${roleId} to ${successCount} users.`);
        permissionCore.saveState();
        return { success: true, count: successCount };
    }
}
