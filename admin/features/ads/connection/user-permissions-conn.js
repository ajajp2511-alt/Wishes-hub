/**
 * Ads to User-Permissions Connection
 * Path: admin/features/ads/connection/user-permissions-conn.js
 * Verifies admin privileges before approving ad campaigns, editing billing structures, or overriding fraud guards.
 */

import { UserPermissionsAssembly } from '../../user-permissions/user-permissions-assembly.js';

export const AdsPermissionsConn = {
    async verifyAdsAdminAccess(adminRole, actionType) {
        try {
            const privilegedActions = ['APPROVE_AD', 'MODIFY_BILLING', 'OVERRIDE_FRAUD'];
            if (privilegedActions.includes(actionType)) {
                const allowedRoles = ['ROOT_ADMIN', 'SUPER_ADMIN', 'ADS_MANAGER'];
                if (!allowedRoles.includes(adminRole)) {
                    return {
                        success: false,
                        error: 'Unauthorized: Performing this advertising action requires Ads Manager or Root privileges.'
                    };
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error verifying ads permissions:', error);
            return { success: false, error: error.message };
        }
    }
};
