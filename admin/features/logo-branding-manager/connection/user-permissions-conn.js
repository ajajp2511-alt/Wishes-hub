/**
 * Logo-Branding-Manager to User-Permissions Connection
 * Path: admin/features/logo-branding-manager/connection/user-permissions-conn.js
 * Verifies if the active admin holds the required clearance to modify global branding assets or multi-studio themes.
 */

import { UserPermissionsAssembly } from '../../user-permissions/user-permissions-assembly.js';

export const LogoBrandingPermissionsConn = {
    async verifyBrandingAccess(adminRole) {
        try {
            const allowedRoles = ['ROOT_ADMIN', 'DESIGN_ADMIN', 'SUPER_ADMIN'];
            if (!allowedRoles.includes(adminRole)) {
                return {
                    success: false,
                    error: 'Unauthorized: Modifying global branding assets requires Design or Root Admin privileges.'
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Error verifying branding permissions:', error);
            return { success: false, error: error.message };
        }
    }
};
