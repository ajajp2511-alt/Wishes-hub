/**
 * Sign-In to User-Permissions Connection
 * Bridges successful admin sign-in with hardware and browser permission verifications.
 */

import { UserPermissionsAssembly } from '../../user-permissions/user-permissions-assembly.js';
import { SignInBiometric } from '../modules/sign-in-passkey.js';

export const SignInUserPermissionsConn = {
    async verifySessionPermissions(adminData, containerElement) {
        try {
            // Initialize user permissions module in the given container
            const permissionsInstance = await UserPermissionsAssembly.init(containerElement);
            
            // Optional: Auto-check biometric or passkey status if required by admin role
            if (adminData && adminData.requiresBiometric) {
                const biometricCheck = await permissionsInstance.handleAction('biometric');
                if (!biometricCheck) {
                    return { success: false, error: 'Biometric verification failed for admin session.' };
                }
            }

            return { success: true, permissionsInstance };
        } catch (error) {
            console.error('Error connecting sign-in to user permissions:', error);
            return { success: false, error: error.message };
        }
    }
};
