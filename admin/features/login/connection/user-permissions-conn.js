/**
 * Login to User-Permissions Connection
 * Bridges successful login session with hardware and access permissions.
 */

import { UserPermissionsAssembly } from '../../user-permissions/user-permissions-assembly.js';

export const LoginUserPermissionsConn = {
    async verifySessionPermissions(sessionData, containerElement) {
        try {
            const permissionsInstance = await UserPermissionsAssembly.init(containerElement);
            
            if (sessionData && sessionData.requiresHardwareCheck) {
                const check = await permissionsInstance.handleAction('verify-hardware');
                if (!check) {
                    return { success: false, error: 'Hardware permission verification failed.' };
                }
            }

            return { success: true, permissionsInstance };
        } catch (error) {
            console.error('Error in login-to-user-permissions connection:', error);
            return { success: false, error: error.message };
        }
    }
};
