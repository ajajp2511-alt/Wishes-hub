/**
 * Wishes Hub - Login Core Controller
 * Orchestrates authentication flow by integrating all security and functional modules.
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
        
        // Make instance globally available for direct inline HTML onclick binding if needed
        window.loginCoreInstance = this;
        
        this.init();
    }

    async init() {
        try {
            const ipCheck = await this.ipWhitelist.validateAccess().catch(() => ({ allowed: true }));

            if (!ipCheck.allowed) {
                document.body.innerHTML = `<div style="text-align:center; margin-top:20vh; font-family:sans-serif;">
                    <h2 style="color:#d9534f;">Access Denied</h2>
                    <p>${ipCheck.message || 'Your IP or region is not authorized to access this portal.'}</p>
                </div>`;
                return;
            }

            if (this.securityGuard.isLockedOut()) {
                const mins = this.securityGuard.getRemainingLockoutMinutes();
                this.showNotification(`Account temporarily locked. Try again in ${mins} minutes.`, 'error');
            }

            this.bindEvents();
        } catch (error) {
            console.error('Initialization Error:', error);
        }
    }

    bindEvents() {
        const loginForm = document.getElementById('login-form');
        const submitBtn = document.getElementById('login-submit-btn') || document.querySelector('#login-form button[type="submit"]');

        if (loginForm) {
            loginForm.onsubmit = async (e) => {
                e.preventDefault();
                await this.executeLoginSequence();
                return false;
            };
        }

        if (submitBtn) {
            submitBtn.onclick = async (e) => {
                if (e) e.preventDefault();
                await this.executeLoginSequence();
                return false;
            };
        }
    }

    async executeLoginSequence() {
        try {
            if (this.securityGuard.isLockedOut()) {
                const mins = this.securityGuard.getRemainingLockoutMinutes();
                alert(`Account is locked. Please wait ${mins} minutes.`);
                return;
            }

            const emailInput = document.getElementById('admin-email');
            const passwordInput = document.getElementById('admin-password');
            
            const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

            const submitBtn = document.getElementById('login-submit-btn') || document.querySelector('#login-form button[type="submit"]');
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.dataset.originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Authenticating...';
            }

            // 🔍 FIXED: Using LoginConfig.endpoints.authenticate to point directly to Render Backend
            const response = await fetch(LoginConfig.endpoints.authenticate, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                throw new Error(`API endpoint returned non-JSON response (Status ${response.status}). Check backend route.`);
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.dataset.originalText || 'Sign In to Dashboard';
            }

            if (!response.ok || !result.ok) {
                const lockoutData = this.securityGuard.recordFailedAttempt();
                await this.auditLogger.logEvent('LOGIN_FAILED', email, 'WARNING', { reason: result.error || 'Invalid credentials' });

                if (lockoutData.locked) {
                    alert('Maximum failed attempts reached. Account locked for 15 minutes.');
                } else {
                    alert(`Invalid credentials. Failed attempts: ${lockoutData.attempts}/${LoginConfig.security.maxLoginAttempts}`);
                }
                return;
            }

            this.securityGuard.resetAttempts();
            const userRole = result.role || 'SUPER_ADMIN';

            const isTrusted = this.trustedDevice.isDeviceTrusted(email);
            
            if (!isTrusted) {
                await this.auditLogger.logEvent('MFA_TRIGGERED', email, 'SUCCESS', { reason: 'New device' });
                const mfaModule = new MfaOtpModule(() => {
                    this.completeSuccessfulLogin(email, userRole);
                });
                mfaModule.renderMfaModal(email, 'Email / WhatsApp');
                return;
            }

            this.completeSuccessfulLogin(email, userRole);

        } catch (error) {
            console.error('Login Error:', error);
            alert('❌ Login Error: ' + error.message);
            
            const submitBtn = document.getElementById('login-submit-btn') || document.querySelector('#login-form button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.dataset.originalText || 'Sign In to Dashboard';
            }
        }
    }

    completeSuccessfulLogin(email, role) {
        localStorage.setItem('wh_admin_token', 'wh_secure_jwt_token_2026');
        localStorage.setItem('wh_user_role', role);

        this.sessionShield.establishShield();
        this.trustedDevice.trustCurrentDevice(email);
        this.auditLogger.logEvent('LOGIN_SUCCESS', email, 'SUCCESS');

        alert('Sign-in successful! Redirecting...');
        window.location.href = LoginConfig.roles.adminPanelPath;
    }

    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

new LoginCore();
