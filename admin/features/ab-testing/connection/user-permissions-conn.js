/**
 * A/B Testing to User-Permissions Connection
 * Path: admin/features/ab-testing/connection/user-permissions-conn.js
 * Verifies admin role clearance before allowing experiment deployment, rollback, or kill-switch activation.
 */

import { UserPermissionsAssembly } from '../../user-permissions/user-permissions-assembly.js';

export const AbTestingPermissionsConn = {
    async verifyExperimentAccess(adminRole, actionType) {
        try {
            const highRiskActions = ['TRIGGER_KILLSWITCH', 'FORCE_ROLLBACK', 'PROMOTE_WINNER'];
            if (highRiskActions.includes(actionType)) {
                const allowedRoles = ['ROOT_ADMIN', 'SUPER_ADMIN', 'EXPERIMENT_MANAGER'];
                if (!allowedRoles.includes(adminRole)) {
                    return {
                        success: false,
                        error: 'Unauthorized: Executing high-risk experiment actions requires Supervisor or Root privileges.'
                    };
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error verifying experiment permissions:', error);
            return { success: false, error: error.message };
        }
    }
};
