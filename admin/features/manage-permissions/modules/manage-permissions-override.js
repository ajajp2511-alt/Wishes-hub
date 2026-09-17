/**
 * Manage Permissions - Emergency Override Sub-Module
 * Implements a "Break-Glass" emergency protocol for temporary superadmin powers with mandatory logging.
 */

import { permissionCore } from '../manage-permissions-core.js';

export class PermissionOverride {
    static triggerBreakGlass(adminId, justificationReason) {
        if (!justificationReason || justificationReason.length < 10) {
            console.error('Valid justification required for emergency override.');
            return false;
        }

        // Temporarily elevate user role to super_admin in memory session
        permissionCore.state.userRoles[adminId] = 'super_admin';
        
        // Log critical action
        permissionCore.logAudit(adminId, 'EMERGENCY_OVERRIDE_ACTIVATED', `Reason: ${justificationReason}`);
        permissionCore.saveState();
        
        return true;
    }
}
