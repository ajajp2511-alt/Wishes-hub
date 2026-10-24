/**
 * Approvals to User-Permissions Connection
 * Path: admin/features/approvals/connection/user-permissions-conn.js
 * Verifies admin role privileges before allowing actions on admin or custom design scopes.
 */

import { UserPermissionsAssembly } from '../../user-permissions/user-permissions-assembly.js';

export const ApprovalsPermissionsConn = {
    async verifyApprovalAccess(adminRole, scopeType) {
        try {
            if (scopeType === 'ADMIN_SCOPE') {
                const allowedRoles = ['ROOT_ADMIN', 'SUPER_ADMIN'];
                if (!allowedRoles.includes(adminRole)) {
                    return {
                        success: false,
                        error: 'Unauthorized: Admin scope approvals require Super Admin or Root Admin privileges.'
                    };
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error verifying approval permissions:', error);
            return { success: false, error: error.message };
        }
    }
};
