/**
 * Admin Sign-In Module - Core State Manager
 * Handles secure session storage, JWT tokens, and emergency clearing.
 */

import { SIGN_IN_CONFIG } from './sign-in-config.js';

class SignInCore {
    constructor() {
        this.session = this.loadSession();
    }

    loadSession() {
        try {
            const raw = localStorage.getItem(SIGN_IN_CONFIG.storageKey);
            return raw ? JSON.parse(raw) : { isAuthenticated: false, admin: null, token: null };
        } catch (err) {
            console.error('[Sign-In Core] Error loading session:', err);
            return { isAuthenticated: false, admin: null, token: null };
        }
    }

    saveSession(adminUser, token) {
        this.session = {
            isAuthenticated: true,
            admin: adminUser,
            token,
            timestamp: Date.now()
        };
        localStorage.setItem(SIGN_IN_CONFIG.storageKey, JSON.stringify(this.session));
    }

    clearSession() {
        this.session = { isAuthenticated: false, admin: null, token: null };
        localStorage.removeItem(SIGN_IN_CONFIG.storageKey);
    }

    isAuthorized() {
        return this.session.isAuthenticated && this.session.admin && this.session.admin.role === 'super-admin' || this.session.admin?.isApproved;
    }

    getToken() {
        return this.session.token;
    }
}

export const signInCore = new SignInCore();
