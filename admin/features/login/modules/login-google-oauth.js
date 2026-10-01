/**
 * Login - Google OAuth Sub-Module
 * Manages Google One-Tap and popup sign-in flows.
 */

import { loginCore } from '../login-core.js';
import { LoginContextResolver } from '../login-context-resolver.js';

export class LoginGoogleOAuth {
    static async handleGoogleLogin(googleTokenResponse, currentPath) {
        try {
            // Process Google token and extract user details
            const mockUser = {
                uid: 'google_usr_' + Date.now(),
                email: googleTokenResponse.email || 'user@gmail.com',
                role: 'user' // Social logins default to standard users
            };
            const mockToken = 'google_jwt_' + Math.random();

            const resolution = LoginContextResolver.resolveRedirect(mockUser.role, currentPath);
            loginCore.saveSession(mockUser, mockToken);

            return { success: true, redirectTo: resolution.redirectTo };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}
