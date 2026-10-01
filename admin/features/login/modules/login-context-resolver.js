/**
 * Login - Context Resolver & Redirection Guard
 * Detects panel type (Admin vs User) and handles cross-panel routing rules.
 */

import { LOGIN_CONFIG, AUTH_ERRORS } from './login-config.js';

export class LoginContextResolver {
    static resolveRedirect(userRole, currentPath) {
        const isAdminPanel = currentPath.includes('/admin/');
        
        if (isAdminPanel) {
            if (userRole === 'admin' || userRole === 'super-admin') {
                return { success: true, redirectTo: LOGIN_CONFIG.routes.adminDashboard };
            } else {
                // Non-admin trying to login via Admin panel -> Redirect to User panel seamlessly
                console.warn(AUTH_ERRORS.unauthorizedAdmin);
                return { 
                    success: false, 
                    redirectUser: true, 
                    redirectTo: LOGIN_CONFIG.routes.userDashboard,
                    message: AUTH_ERRORS.unauthorizedAdmin 
                };
            }
        } else {
            // Standard User Panel Login
            return { success: true, redirectTo: LOGIN_CONFIG.routes.userDashboard };
        }
    }
}
