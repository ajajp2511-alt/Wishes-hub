/**
 * Wishes Hub - Admin Panel Auth Guard
 * Protects admin dashboard routes by verifying tokens instantly.
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
            // 1. Instant Synchronous Token Check
            const token = localStorage.getItem('wh_admin_token');
            const role = localStorage.getItem('wh_user_role');

            if (!token || !role) {
                this.redirectToLogin('Authentication token missing. Please log in.');
                return;
            }

            // 2. Validate Session Shield (Anti-Hijacking)
            const shieldCheck = await this.sessionShield.validateShield();
            if (!shieldCheck.valid) {
                this.redirectToLogin(shieldCheck.reason || 'Security integrity violation detected.');
                return;
            }

            // 3. Initialize Inactivity Session Handler
            new SessionHandler();

            console.log('Admin Guard: Session verified successfully.');

            // ✅ Token valid hone ke baad hi admin features load karein
            this.loadAdminFeatures();

        } catch (error) {
            console.error('Admin Guard Error:', error);
            this.redirectToLogin('An unexpected security error occurred.');
        }
    }

    loadAdminFeatures() {
        // Dynamically load features-assembly only after successful auth verification
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
        
        // Redirect immediately using replace so users cannot go back
        const loginPath = LoginConfig?.roles?.loginPath || '/admin/features/login/login';
        window.location.replace(loginPath);
    }
}

// Run guard instantly when script loads
new AdminGuard();
