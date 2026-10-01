/**
 * Login - Email & Password Sub-Module
 * Handles standard email/password sign-in and sign-up execution.
 */

import { loginCore } from '../login-core.js';
import { LoginContextResolver } from '../login-context-resolver.js';

export class LoginEmailPass {
    static async signIn(email, password, currentPath) {
        try {
            // Mock authentication call (Replace with actual Firebase auth.signInWithEmailAndPassword)
            if (!email || !password) {
                throw new Error('Email aur password bharna anivarya hai.');
            }

            // Mock fetched user data & role
            const mockUser = {
                uid: 'usr_' + Date.now(),
                email: email,
                role: email.includes('admin') ? 'admin' : 'user'
            };
            const mockToken = 'jwt_token_sample_' + Math.random();

            // Check panel context and routing rules
            const resolution = LoginContextResolver.resolveRedirect(mockUser.role, currentPath);
            
            if (!resolution.success && resolution.redirectUser) {
                loginCore.saveSession(mockUser, mockToken);
                return { success: true, redirectedToUserPanel: true, redirectTo: resolution.redirectTo, message: resolution.message };
            }

            if (!resolution.success) {
                throw new Error(resolution.message || 'Access denied');
            }

            loginCore.saveSession(mockUser, mockToken);
            return { success: true, redirectTo: resolution.redirectTo };

        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}
