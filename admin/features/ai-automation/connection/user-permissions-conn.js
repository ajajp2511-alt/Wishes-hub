/**
 * AI & Automation to User-Permissions Connection
 * Path: admin/features/ai-automation/connection/user-permissions-conn.js
 * Verifies admin role access before editing prompt presets, modifying auto-pilot rules, or altering API token limits.
 */

import { UserPermissionsAssembly } from '../../user-permissions/user-permissions-assembly.js';

export const AiAutomationPermissionsConn = {
    async verifyAiAdminAccess(adminRole, actionType) {
        try {
            const restrictedActions = ['MODIFY_PRESETS', 'CONFIGURE_AUTOPILOT', 'OVERRIDE_TOKEN_LIMITS'];
            if (restrictedActions.includes(actionType)) {
                const allowedRoles = ['ROOT_ADMIN', 'SUPER_ADMIN', 'AI_STUDIO_MANAGER'];
                if (!allowedRoles.includes(adminRole)) {
                    return {
                        success: false,
                        error: 'Unauthorized: Performing this AI configuration requires AI Manager or Root privileges.'
                    };
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Error verifying AI automation permissions:', error);
            return { success: false, error: error.message };
        }
    }
};
