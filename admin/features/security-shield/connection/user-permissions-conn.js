/**
 * Notifications to User-Permissions Connection
 * Verifies if the active admin has the required role and permissions to send broadcasts or alerts.
 */

import { UserPermissionsAssembly } from '../../user-permissions/user-permissions-assembly.js';

export const NotificationsPermissionsConn = {
    async verifyBroadcastAccess(adminRole) {
        try {
            // Allowed roles for broadcasting
            const allowedRoles = ['ROOT_ADMIN', 'MARKETING_ADMIN', 'SUPER_ADMIN'];
            if (!allowedRoles.includes(adminRole)) {
                return {
                    success: false,
                    error: 'Insufficient permissions to dispatch system-wide notifications.'
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Error verifying broadcast permissions:', error);
            return { success: false, error: error.message };
        }
    }
};
