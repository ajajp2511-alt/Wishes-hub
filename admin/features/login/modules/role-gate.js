/**
 * Wishes Hub - Role Gate Module
 * Enforces role-based access control (RBAC) and restricts unauthorized access.
 */

import { LoginConfig } from '../login-config.js';

export class RoleGateModule {
    /**
     * Check if the currently authenticated user has the required permission level
     */
    static verifyAccess(requiredRole = LoginConfig.roles.subAdminRole) {
        const userRole = localStorage.getItem('wh_user_role');
        const token = localStorage.getItem('wh_admin_token');

        if (!token || !userRole) {
            return {
                authorized: false,
                redirectUrl: '/admin/login.html',
                message: 'Authentication required. Please sign in.'
            };
        }

        const roles = LoginConfig.roles;

        // Super Admin has access to everything
        if (userRole === roles.superAdminRole) {
            return { authorized: true };
        }

        // If Super Admin role is strictly required but user is only a Sub-Admin or User
        if (requiredRole === roles.superAdminRole && userRole !== roles.superAdminRole) {
            return {
                authorized: false,
                redirectUrl: roles.adminPanelPath,
                message: 'Access Denied: Requires Super Admin privileges.'
            };
        }

        // Normal users trying to access admin panel are routed to user panel
        if (userRole === roles.userRole) {
            return {
                authorized: false,
                redirectUrl: roles.userPanelPath,
                message: 'Unauthorized role. Redirecting to User Panel.'
            };
        }

        return { authorized: true };
    }
}
