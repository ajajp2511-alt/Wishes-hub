/**
 * Wishes Hub - Sign-In Event Handler Module
 * Binds form submission events, handles input capture, and triggers core authentication.
 */

import { LoginCore } from '../login-core.js';
import { MfaOtpModule } from './mfa-otp.js';
import { LoginConfig } from '../login-config.js';

export class SigninModule {
    constructor() {
        this.core = new LoginCore();
        this.initListeners();
    }

    initListeners() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('admin-email');
            const passwordInput = document.getElementById('admin-password');
            const captchaInput = document.getElementById('captcha-input');
            const submitBtn = loginForm.querySelector('button[type="submit"]') || document.getElementById('login-submit-btn');

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            const captchaResponse = captchaInput ? captchaInput.value.trim() : null;

            // Basic frontend validation
            if (!email || !password) {
                this.showToast('Please enter both email and password.', 'error');
                return;
            }

            try {
                // Set loading state on submit button
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.dataset.originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Signing in... 🔄';
                }

                // Trigger Core Authentication Processing
                const result = await this.core.authenticateUser(email, password, captchaResponse);
                this.handleAuthResponse(result, email);
            } catch (error) {
                console.error('Signin Exception:', error);
                this.showToast('An unexpected error occurred. Please try again.', 'error');
            } finally {
                // Restore submit button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText || 'Sign In';
                }
            }
        });
    }

    handleAuthResponse(result, email) {
        switch (result.status) {
            case 'SUCCESS':
                this.showToast('Login successful! Redirecting to Admin Panel...', 'success');
                setTimeout(() => {
                    window.location.href = result.redirectUrl || LoginConfig.roles.adminPanelPath;
                }, 1000);
                break;

            case 'REDIRECT_USER':
                this.showToast(result.message || 'Redirecting...', 'warning');
                setTimeout(() => {
                    window.location.href = result.redirectUrl || '/user/dashboard.html';
                }, 1200);
                break;

            case 'REQUIRES_MFA':
                this.showToast('MFA verification required. Please enter OTP.', 'info');
                // 🚀 Trigger MFA OTP Modal directly when required
                const mfaModule = new MfaOtpModule(() => {
                    this.showToast('OTP verified successfully! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = LoginConfig.roles.adminPanelPath;
                    }, 1000);
                });
                mfaModule.renderMfaModal(email, 'Email');
                break;

            case 'ERROR':
            default:
                this.showToast(result.message || 'Authentication failed. Please try again.', 'error');
                break;
        }
    }

    showToast(message, type = 'info') {
        let toast = document.getElementById('login-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'login-toast';
            toast.className = 'login-toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.className = `login-toast show ${type}`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}
