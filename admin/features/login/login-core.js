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
        alert('⚡ LoginCore Constructor Called'); // 🔍 Check point A
        this.securityGuard = new SecurityGuard();
        this.trustedDevice = new TrustedDeviceModule();
        this.auditLogger = new AuditLogger();
        this.sessionShield = new SessionShield();
        this.ipWhitelist = new IpWhitelistModule();
        
        this.init();
    }

    async init() {
        try {
            alert('⚡ Init Started'); // 🔍 Check point B

            // 1. Validate IP and Geo-Fencing before rendering or processing
            const ipCheck = await this.ipWhitelist.validateAccess().catch(err => {
                console.error('IP Whitelist Error:', err);
                return { allowed: true }; // Fallback to allow if module fails
            });

            alert(`⚡ IP Check Result: ${ipCheck.allowed}`); // 🔍 Check point C

            if (!ipCheck.allowed) {
                document.body.innerHTML = `<div style="text-align:center; margin-top:20vh; font-family:sans-serif;">
                    <h2 style="color:#d9534f;">Access Denied</h2>
                    <p>${ipCheck.message || 'Your IP or region is not authorized to access this portal.'}</p>
                </div>`;
                return;
            }

            // 2. Check if account is locked out on load
            if (this.securityGuard.isLockedOut()) {
                const mins = this.securityGuard.getRemainingLockoutMinutes();
                this.showNotification(`Account temporarily locked due to multiple failed attempts. Try again in ${mins} minutes.`, 'error');
            }

            this.bindEvents();
            alert('⚡ BindEvents Completed Successfully'); // 🔍 Check point D

        } catch (error) {
            console.error('Initialization Error:', error);
            alert('❌ Init Catch Error: ' + error.message);
        }
    }

    bindEvents() {
        const loginForm = document.getElementById('login-form');
        const submitBtn = document.querySelector('#login-submit-btn, #login-form button[type="submit"], button[type="submit"]');
        
        if (!loginForm) {
            alert('❌ ERROR: #login-form nahi mila HTML mein!');
            return;
        }

        const handleLoginAction = async (e) => {
            if (e) e.preventDefault();
            alert('🚀 Step 1: Login Action Triggered!'); 
            
            if (this.securityGuard.isLockedOut()) {
                const mins = this.securityGuard.getRemainingLockoutMinutes();
                alert(`Account is locked. Please wait ${mins} minutes before trying again.`);
                return;
            }

            const emailInput = document.getElementById('admin-email');
            const passwordInput = document.getElementById('admin-password');
            
            const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            alert(`📧 Email: ${email} | 🔑 Password length: ${password.length}`);

            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

            await this.handleSignInAttempt(email, password);
        };

        loginForm.addEventListener('submit', handleLoginAction);

        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                handleLoginAction(e);
            });
        }
    }

    async handleSignInAttempt(email, password) {
        const submitBtn = document.querySelector('#login-submit-btn, #login-form button[type="submit"]');
        
        try {
            alert('Step 2: Inside handleSignInAttempt');

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.dataset.originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Authenticating...';
            }

            alert('Step 3: About to fetch /api/verify-pass');

            const response = await fetch('/api/verify-pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            alert(`Step 4: Response status code: ${response.status}`);

            const result = await response.json();

            if (!response.ok || !result.ok) {
                const lockoutData = this.securityGuard.recordFailedAttempt();
                await this.auditLogger.logEvent('LOGIN_FAILED', email, 'WARNING', { reason: result.error || 'Invalid credentials' });

                if (lockoutData.locked) {
                    alert('Maximum failed attempts reached. Account has been locked for 15 minutes.');
                } else {
                    alert(`Invalid credentials. Failed attempts: ${lockoutData.attempts}/${LoginConfig.security.maxLoginAttempts}`);
                }
                return;
            }

            this.securityGuard.resetAttempts();
            const userRole = result.role || 'SUB_ADMIN';

            const isTrusted = this.trustedDevice.isDeviceTrusted(email);
            
            if (!isTrusted) {
                await this.auditLogger.logEvent('MFA_TRIGGERED', email, 'SUCCESS', { reason: 'New or untrusted device' });
                
                const mfaModule = new MfaOtpModule(() => {
                    this.completeSuccessfulLogin(email, userRole);
                });
                mfaModule.renderMfaModal(email, 'Email / WhatsApp');
                return;
            }

            this.completeSuccessfulLogin(email, userRole);

        } catch (error) {
            console.error('Sign-in Error:', error);
            alert('❌ Catch Error: ' + error.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.dataset.originalText || 'Sign In';
            }
        }
    }

    completeSuccessfulLogin(email, role) {
        localStorage.setItem('wh_admin_token', 'wh_secure_jwt_token_2026');
        localStorage.setItem('wh_user_role', role);

        this.sessionShield.establishShield();
        this.trustedDevice.trustCurrentDevice(email);
        this.auditLogger.logEvent('LOGIN_SUCCESS', email, 'SUCCESS');

        alert('Sign-in successful! Redirecting to Admin Panel...');
        window.location.href = LoginConfig.roles.adminPanelPath;
    }

    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// ✅ Correct instantiation for ES Modules
new LoginCore();
