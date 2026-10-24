/**
 * Security-Shield to User-Permissions Connection
 * Validates whether the active admin has root clearance to modify firewall rules or trigger lockdowns.
 */

import { UserPermissionsAssembly } from '../../user-permissions/user-permissions-assembly.js';

export const SecurityShieldPermissionsConn = {
    async verifySecurityAdminAccess(adminRole) {
        try {
            const authorizedRoles = ['ROOT_ADMIN', 'SECURITY_ADMIN'];
            if (!authorizedRoles.includes(adminRole)) {
                return {
                    success: false,
                    error: 'Unauthorized: Security shield modifications require Security or Root Admin privileges.'
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Error verifying security admin permissions:', error);
            return { success: false, error: error.message };
        }
    }
};
