/**
 * Wishes Hub - Admin Panel Auth Guard
 * Protects admin dashboard routes by verifying tokens, session shields, and initializing session timeouts.
 */

import { SessionShield } from './features/modules/session-shield.js';
import { SessionHandler } from './features/modules/session-handler.js';
import { LoginConfig } from './features/login/login-config.js';

class AdminGuard {
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

            // 🛑 Extra Safety Check: Basic token format/validity check 
            // (Agar token "undefined", "null" ya khali string hai toh block karein)
            if (token === 'undefined' || token === 'null' || token.trim() === '') {
                this.redirectToLogin('Invalid authentication token.');
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

            console.log('Admin Guard: Session verified successfully.');

            // ✅ Sab kuch sahi hone par hi admin features load honge
            this.loadAdminFeatures();

        } catch (error) {
            console.error('Admin Guard Error:', error);
            this.redirectToLogin('An unexpected security error occurred.');
        }
    }

    loadAdminFeatures() {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '/admin/features/features-assembly.js';
        document.body.appendChild(script);
    }

    redirectToLogin(reason) {
        console.warn(`Admin Access Blocked: ${reason}`);
        
        // Clear sensitive session data
        localStorage.removeItem('wh_admin_token');
        localStorage.removeItem('wh_user_role');
        try {
            this.sessionShield.clearShield();
        } catch (e) {}
        
        // Redirect immediately using replace so user cannot go back
        const loginPath = LoginConfig?.roles?.loginPath || '/admin/features/login/login';
        window.location.replace(loginPath);
    }
}

// Run guard instantly when the script is parsed
new AdminGuard();
