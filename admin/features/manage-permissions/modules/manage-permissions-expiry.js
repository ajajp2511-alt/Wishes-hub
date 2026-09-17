/**
 * Manage Permissions - Expiry Sub-Module
 * Manages temporary access grants that automatically expire after a set time.
 */

import { permissionCore } from '../manage-permissions-core.js';

export class PermissionExpiry {
    static grantTemporaryAccess(userId, roleId, durationInHours, adminId) {
        const expiresAt = Date.now() + (durationInHours * 60 * 60 * 1000);
        
        if (!permissionCore.state.temporaryAccess) {
            permissionCore.state.temporaryAccess = {};
        }

        permissionCore.state.temporaryAccess[userId] = {
            roleId,
            expiresAt
        };

        permissionCore.logAudit(adminId, 'TEMP_ACCESS_GRANT', `Granted ${roleId} to ${userId} for ${durationInHours} hours.`);
        permissionCore.saveState();
    }

    static validateTemporaryAccess(userId) {
        const tempRecord = permissionCore.state.temporaryAccess?.[userId];
        if (!tempRecord) return null;

        if (Date.now() > tempRecord.expiresAt) {
            // Access Expired, clean it up
            delete permissionCore.state.temporaryAccess[userId];
            permissionCore.logAudit('system', 'TEMP_ACCESS_EXPIRED', `Temporary access for ${userId} has expired.`);
            permissionCore.saveState();
            return null;
        }

        return tempRecord.roleId;
    }
}
