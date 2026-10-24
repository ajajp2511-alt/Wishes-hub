/**
 * Manage-Home to User-Permissions Connection
 * Path: admin/features/manage-home/connection/user-permissions-conn.js
 * Verifies admin rights to publish announcements or modify widgets on the home dashboard.
 */

import { UserPermissionsAssembly } from '../../user-permissions/user-permissions-assembly.js';

export const ManageHomePermissionsConn = {
    async verifyHomeActionAccess(adminRole, actionType) {
        try {
            const restrictedActions = ['PUBLISH_ANNOUNCEMENT', 'MODIFY_WIDGETS'];
            if (restrictedActions.includes(actionType)) {
                const allowedRoles = ['ROOT_ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'];
                if (!allowedRoles.includes(adminRole)) {
                    return {
                        success: false,
                        error: 'Unauthorized: You do not have permission to execute this home dashboard action.'
                    };
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error verifying home permissions:', error);
            return { success: false, error: error.message };
        }
    }
};
