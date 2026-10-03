/**
 * Wishes Hub - Login Core Controller
 * Orchestrates authentication flow by integrating all 16 security and functional modules.
 */

import { LoginConfig } from './login-config.js';
import { SecurityGuard } from './modules/security-guard.js';
import { TrustedDeviceModule } from './modules/trusted-device.js';
import { AuditLogger } from './modules/audit-logger.js';
import { SessionShield } from './modules/session-shield.js';
import { RoleGateModule } from './modules/role-gate.js';
import { MfaOtpModule } from './modules/mfa-otp.js';
import { IpWhitelistModule } from './modules/ip-whitelist.js';

export class LoginCore {
    constructor() {
        this.securityGuard = new SecurityGuard();
        this.trustedDevice = new TrustedDeviceModule();
        this.auditLogger = new AuditLogger();
        this.sessionShield = new SessionShield();
        this.ipWhitelist = new IpWhitelistModule();
        
        this.init();
    }

    async init() {
        // 1. Validate IP and Geo-Fencing before rendering or processing
        const ipCheck = await this.ipWhitelist.validateAccess();
        if (!ipCheck.allowed) {
            document.body.innerHTML = `<div style="text-align:center; margin-top:20vh; font-family:sans-serif;">
                <h2 style="color:#d9534f;">Access Denied</h2>
                <p>${ipCheck.message}</p>
            </div>`;
            return;
        }

        // 2. Check if account is locked out
        if (this.securityGuard.isLockedOut()) {
            const mins = this.securityGuard.getRemainingLockoutMinutes();
            alert(`Account temporarily locked due to multiple failed attempts. Try again in ${mins} minutes.`);
        }

        this.bindEvents();
    }

    bindEvents() {
        const loginForm = document.getElementById('admin-login-form');
        if (!loginForm) return;

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.securityGuard.isLockedOut()) {
                alert('Account is locked. Please wait before trying again.');
                return;
            }

            const email = document.getElementById('admin-email').value.trim();
            const password = document.getElementById('admin-password').value.trim();

            await this.handleSignInAttempt(email, password);
        });
    }

    async handleSignInAttempt(email, password) {
        try {
            // Simulating API authentication request
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock successful credentials check
            const isValidCredentials = (email === 'admin@wisheshub.com' && password === 'Secret@2026');

            if (!isValidCredentials) {
                const lockoutData = this.securityGuard.recordFailedAttempt();
                await this.auditLogger.logEvent('LOGIN_FAILED', email, 'WARNING', { reason: 'Invalid credentials' });

                if (lockoutData.locked) {
                    alert('Maximum failed attempts reached. Account has been locked for 15 minutes.');
                } else {
                    alert(`Invalid credentials. Failed attempts: ${lockoutData.attempts}/${LoginConfig.security.maxLoginAttempts}`);
                }
                return;
            }

            // Reset security guard attempts on success
            this.securityGuard.resetAttempts();

            // Check if device is trusted, else trigger MFA
            const isTrusted = this.trustedDevice.isDeviceTrusted(email);
            
            if (!isTrusted) {
                await this.auditLogger.logEvent('MFA_TRIGGERED', email, 'SUCCESS', { reason: 'New or untrusted device' });
                
                // Trigger MFA Modal
                const mfaModule = new MfaOtpModule(() => {
                    this.completeSuccessfulLogin(email, 'SUPER_ADMIN');
                });
                mfaModule.renderMfaModal(email, 'Email / WhatsApp');
                return;
            }

            this.completeSuccessfulLogin(email, 'SUPER_ADMIN');

        } catch (error) {
            console.error('Sign-in Error:', error);
            alert('An unexpected error occurred during sign in.');
        }
    }

    completeSuccessfulLogin(email, role) {
        // Set tokens and role
        localStorage.setItem('wh_admin_token', 'wh_mock_secure_jwt_token_2026');
        localStorage.setItem('wh_user_role', role);

        // Establish Anti-Hijacking Shield
        this.sessionShield.establishShield();

        // Trust device for future logins
        this.trustedDevice.trustCurrentDevice(email);

        // Log successful audit event
        this.auditLogger.logEvent('LOGIN_SUCCESS', email, 'SUCCESS');

        alert('Sign-in successful! Redirecting to Admin Panel...');
        window.location.href = LoginConfig.roles.adminPanelPath;
    }
}

// Initialize LoginCore when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LoginCore();
});
