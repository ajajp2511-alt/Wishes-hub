/**
 * Affiliate to User-Permissions Connection
 * Path: admin/features/affiliate/connection/user-permissions-conn.js
 * Verifies admin role privileges before managing affiliate API keys, commission structures, or payout releases.
 */

import { UserPermissionsAssembly } from '../../user-permissions/user-permissions-assembly.js';

export const AffiliatePermissionsConn = {
    async verifyAffiliateAdminAccess(adminRole, actionType) {
        try {
            const restrictedActions = ['RELEASE_PAYOUT', 'MODIFY_COMMISSION', 'CONFIGURE_API_HUB'];
            if (restrictedActions.includes(actionType)) {
                const allowedRoles = ['ROOT_ADMIN', 'SUPER_ADMIN', 'AFFILIATE_MANAGER'];
                if (!allowedRoles.includes(adminRole)) {
                    return {
                        success: false,
                        error: 'Unauthorized: Performing this affiliate action requires Affiliate Manager or Root privileges.'
                    };
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error verifying affiliate permissions:', error);
            return { success: false, error: error.message };
        }
    }
};
