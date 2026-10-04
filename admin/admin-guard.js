/**
 * Wishes Hub - Admin Panel Auth Guard
 * Protects admin dashboard routes by verifying tokens, session shields, and initializing session timeouts.
 */

import { SessionShield } from './features/modules/session-shield.js';
import { SessionHandler } from './features/modules/session-handler.js';
import { LoginConfig } from './features/login/login-config.js';

export class AdminGuard {
    constructor() {
        this.sessionShield = new SessionShield();
        this.initGuard();
    }

    async initGuard() {
        try {
            // 1. Check if admin token and role exist in localStorage
            const token = localStorage.getItem('wh_admin_token');
            const role = localStorage.getItem('wh_user_role');

            if (!token || !role) {
                this.redirectToLogin('Authentication token missing. Please log in.');
                return;
            }

            // 2. Validate Session Shield against device fingerprint (Anti-Hijacking)
            const shieldCheck = await this.sessionShield.validateShield();
            if (!shieldCheck.valid) {
                this.redirectToLogin(shieldCheck.reason || 'Security integrity violation detected.');
                return;
            }

            // 3. Initialize Inactivity Session Handler & Multi-tab Sync
            new SessionHandler();

            console.log('Admin Guard: Session verified successfully. Welcome to Wishes Hub Admin.');
        } catch (error) {
            console.error('Admin Guard Error:', error);
            this.redirectToLogin('An unexpected security error occurred.');
        }
    }

    redirectToLogin(reason) {
        console.warn(`Admin Access Blocked: ${reason}`);
        
        // Clear sensitive session data
        localStorage.removeItem('wh_admin_token');
        localStorage.removeItem('wh_user_role');
        this.sessionShield.clearShield();
        
        alert(reason);
        
        // Updated login path pointing directly to your features/login folder structure
        const loginPath = LoginConfig?.roles?.loginPath || '/admin/features/login/login.html';
        window.location.href = loginPath;
    }
}

// Run guard automatically when any admin panel page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdminGuard();
});
