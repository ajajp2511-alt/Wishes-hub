/**
 * Wishes Hub - Role Gate Module
 * Enforces role-based access control (RBAC) and restricts unauthorized access.
 */

import { LoginConfig } from '../login-config.js';

export class RoleGateModule {
    /**
     * Role hierarchy weighting for privilege comparison
     */
    static roleWeights = {
        [LoginConfig?.roles?.userRole || 'USER']: 1,
        [LoginConfig?.roles?.subAdminRole || 'SUB_ADMIN']: 2,
        [LoginConfig?.roles?.superAdminRole || 'SUPER_ADMIN']: 3
    };

    /**
     * Check if the currently authenticated user has the required permission level
     */
    static verifyAccess(requiredRole = LoginConfig?.roles?.subAdminRole || 'SUB_ADMIN') {
        const userRole = localStorage.getItem('wh_user_role');
        const token = localStorage.getItem('wh_admin_token');

        const roles = LoginConfig?.roles || {
            superAdminRole: 'SUPER_ADMIN',
            adminPanelPath: '/admin/dashboard.html',
            userPanelPath: '/user/dashboard.html',
            loginPath: '/admin/login.html'
        };

        if (!token || !userRole) {
            return {
                authorized: false,
                redirectUrl: roles.loginPath || '/admin/login.html',
                message: 'Authentication required. Please sign in.'
            };
        }

        // Normal users trying to access admin panel are routed to user panel
        if (userRole === roles.userRole && requiredRole !== roles.userRole) {
            return {
                authorized: false,
                redirectUrl: roles.userPanelPath || '/user/dashboard.html',
                message: 'Unauthorized role. Redirecting to User Panel.'
            };
        }

        // Compare role privilege weights
        const userWeight = RoleGateModule.roleWeights[userRole] || 0;
        const requiredWeight = RoleGateModule.roleWeights[requiredRole] || 2;

        if (userWeight < requiredWeight) {
            const redirectTarget = userRole === roles.userRole ? roles.userPanelPath : (roles.adminPanelPath || '/admin/dashboard.html');
            return {
                authorized: false,
                redirectUrl: redirectTarget,
                message: `Access Denied: Requires higher privilege level (${requiredRole}).`
            };
        }

        return { authorized: true };
    }
    }
