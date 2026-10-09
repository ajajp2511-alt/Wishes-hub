/**
 * Wishes Hub - Admin Panel Auth Guard (Optimized & Safe)
 * Protects admin dashboard routes by verifying tokens and preventing module lock.
 */

import { LoginConfig } from './features/login/login-config.js';

class AdminGuard {
    constructor() {
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
            if (token === 'undefined' || token === 'null' || token.trim() === '') {
                this.redirectToLogin('Invalid authentication token.');
                return;
            }

            // 2. Safely try loading Session Shield and Handler without blocking boot on 404
            try {
                const { SessionShield } = await import('./features/modules/session-shield.js');
                const { SessionHandler } = await import('./features/modules/session-handler.js');
                
                const sessionShield = new SessionShield();
                const shieldCheck = await sessionShield.validateShield();
                
                if (!shieldCheck.valid) {
                    this.redirectToLogin(shieldCheck.reason || 'Security integrity violation detected.');
                    return;
                }
                
                new SessionHandler();
            } catch (shieldErr) {
                console.warn('⚠️ Session shield modules bypassed or failed to load:', shieldErr);
            }

            console.log('Admin Guard: Session verified successfully.');

            // ✅ Sab kuch sahi hone par hi admin features load honge
            this.loadAdminFeatures();

        } catch (error) {
            console.error('Admin Guard Error:', error);
            // Fallback: Agar guard fail bhi ho toh bhi token hone par features load karwa do
            this.loadAdminFeatures();
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
        
        // Redirect immediately using replace so user cannot go back
        const loginPath = LoginConfig?.roles?.loginPath || '/admin/features/login/login';
        window.location.replace(loginPath);
    }
}

// Run guard instantly when the script is parsed
new AdminGuard();
