/**
 * Wishes Hub - Admin Login Core Verification Logic
 * Handles credential verification, role-gate routing, and authentication flow.
 */

import { LoginConfig } from './login-config.js';

export class LoginCore {
    constructor() {
        this.isLoading = false;
    }

    /**
     * Process login submission
     */
    async authenticateUser(email, password, captchaResponse = null) {
        try {
            this.setLoading(true);

            // Payload for authentication request
            const payload = {
                email,
                password,
                captchaResponse,
                timestamp: Date.now()
            };

            // Simulating API call to backend authentication endpoint
            // In production, replace with actual fetch call: 
            // const response = await fetch(LoginConfig.endpoints.authenticate, { method: 'POST', body: JSON.stringify(payload) });
            
            const response = await this.mockAuthApiCall(payload);

            if (!response.success) {
                throw new Error(response.message || 'Authentication failed.');
            }

            const { user, token, requiresMfa } = response.data;

            // Handle MFA requirement if enabled
            if (requiresMfa) {
                return {
                    status: 'REQUIRES_MFA',
                    userId: user.id,
                    availableChannels: ['email', 'whatsapp']
                };
            }

            // Execute Role-Gate Check & Redirection
            return this.handleRoleRouting(user, token);

        } catch (error) {
            console.error('Login Error:', error);
            return {
                status: 'ERROR',
                message: error.message
            };
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Role-Gate & Redirection Logic based on user roles
     */
    handleRoleRouting(user, token) {
        // Save session token securely
        localStorage.setItem('wh_admin_token', token);
        localStorage.setItem('wh_user_role', user.role);

        const roles = LoginConfig.roles;

        if (user.role === roles.superAdminRole || user.role === roles.subAdminRole) {
            // Valid Admin: Proceed to Admin Dashboard
            return {
                status: 'SUCCESS',
                redirectUrl: roles.adminPanelPath,
                role: user.role
            };
        } else {
            // Normal User trying to access admin login: Redirect to User Panel
            return {
                status: 'REDIRECT_USER',
                redirectUrl: roles.userPanelPath,
                message: 'Access restricted. Redirecting to User Panel...'
            };
        }
    }

    /**
     * Mock API Call helper (Placeholder for actual backend integration)
     */
    async mockAuthApiCall(payload) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Example check for simulation purposes
                if (payload.email === 'superadmin@wisheshub.com') {
                    resolve({
                        success: true,
                        data: {
                            user: { id: 'ADM_001', role: 'SUPER_ADMIN', email: payload.email },
                            token: 'mock-jwt-token-super-admin',
                            requiresMfa: false
                        }
                    });
                } else if (payload.email === 'user@wisheshub.com') {
                    resolve({
                        success: true,
                        data: {
                            user: { id: 'USR_999', role: 'USER', email: payload.email },
                            token: 'mock-jwt-token-user',
                            requiresMfa: false
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid email or password.'
                    });
                }
            }, 1000);
        });
    }

    setLoading(isLoading) {
        this.isLoading = isLoading;
        const submitBtn = document.getElementById('login-submit-btn');
        if (submitBtn) {
            const spinner = submitBtn.querySelector('.spinner');
            const btnText = submitBtn.querySelector('.btn-text');
            if (spinner && btnText) {
                spinner.classList.toggle('hidden', !isLoading);
                btnText.textContent = isLoading ? 'Signing In...' : 'Sign In';
                submitBtn.disabled = isLoading;
            }
        }
    }
}
