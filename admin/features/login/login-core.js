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
                console.log(`Account temporarily locked. Try again in ${mins} minutes.`);
            }
        } catch (error) {
            console.error('Initialization Error:', error);
        }
    }

    /**
     * Called by SigninModule to authenticate user against Render Backend with Timeout Protection
     */
    async authenticateUser(email, password, captchaResponse) {
        try {
            if (this.securityGuard.isLockedOut()) {
                const mins = this.securityGuard.getRemainingLockoutMinutes();
                return { status: 'ERROR', message: `Account is locked. Please wait ${mins} minutes.` };
            }

            // ⏱️ Add a 25-second timeout controller for Render free-tier cold starts
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000);

            let response;
            try {
                response = await fetch(LoginConfig.endpoints.authenticate, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password, captcha: captchaResponse }),
                    signal: controller.signal
                });
            } finally {
                clearTimeout(timeoutId);
            }

            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                throw new Error(`API endpoint returned non-JSON response (Status ${response.status}).`);
            }

            if (!response.ok || !result.ok) {
                const lockoutData = this.securityGuard.recordFailedAttempt();
                await this.auditLogger.logEvent('LOGIN_FAILED', email, 'WARNING', { reason: result.error || 'Invalid credentials' });

                if (lockoutData.locked) {
                    return { status: 'ERROR', message: 'Maximum failed attempts reached. Account locked for 15 minutes.' };
                } else {
                    return { status: 'ERROR', message: `Invalid credentials. Failed attempts: ${lockoutData.attempts}/${LoginConfig.security.maxLoginAttempts}` };
                }
            }

            this.securityGuard.resetAttempts();
            const userRole = result.role || 'SUPER_ADMIN';

            const isTrusted = this.trustedDevice.isDeviceTrusted(email);
            
            if (!isTrusted) {
                await this.auditLogger.logEvent('MFA_TRIGGERED', email, 'SUCCESS', { reason: 'New device' });
                
                // Trigger MFA OTP Modal
                const mfaModule = new MfaOtpModule(() => {
                    this.completeSuccessfulLogin(email, userRole);
                    window.location.href = LoginConfig.roles.adminPanelPath;
                });
                mfaModule.renderMfaModal(email, 'Email');

                return { status: 'REQUIRES_MFA', message: 'MFA verification required.' };
            }

            this.completeSuccessfulLogin(email, userRole);
            return { status: 'SUCCESS', redirectUrl: LoginConfig.roles.adminPanelPath };

        } catch (error) {
            console.error('Authentication Error:', error);
            if (error.name === 'AbortError') {
                return { status: 'ERROR', message: 'Server took too long to respond (Render cold start). Please try again.' };
            }
            return { status: 'ERROR', message: error.message || 'Authentication failed.' };
        }
    }

    completeSuccessfulLogin(email, role) {
        localStorage.setItem('wh_admin_token', 'wh_secure_jwt_token_2026');
        localStorage.setItem('wh_user_role', role);

        this.sessionShield.establishShield();
        this.trustedDevice.trustCurrentDevice(email);
        this.auditLogger.logEvent('LOGIN_SUCCESS', email, 'SUCCESS');
    }
}
