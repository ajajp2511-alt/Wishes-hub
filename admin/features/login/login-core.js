/**
 * Login & Authentication - Core Logic
 * Handles Firebase Auth wrappers, session management, and persistent storage.
 */

import { LOGIN_CONFIG } from './login-config.js';

class LoginCore {
    constructor() {
        this.session = this.loadSession();
    }

    loadSession() {
        try {
            const data = localStorage.getItem(LOGIN_CONFIG.storageKey);
            return data ? JSON.parse(data) : { isAuthenticated: false, user: null, token: null };
        } catch (e) {
            console.error('Failed to load session', e);
            return { isAuthenticated: false, user: null, token: null };
        }
    }

    saveSession(userData, token) {
        this.session = {
            isAuthenticated: true,
            user: userData,
            token,
            lastActive: Date.now()
        };
        localStorage.setItem(LOGIN_CONFIG.storageKey, JSON.stringify(this.session));
    }

    clearSession() {
        this.session = { isAuthenticated: false, user: null, token: null };
        localStorage.removeItem(LOGIN_CONFIG.storageKey);
    }

    getCurrentUser() {
        return this.session.user;
    }

    isLoggedIn() {
        return this.session.isAuthenticated;
    }
}

export const loginCore = new LoginCore();
