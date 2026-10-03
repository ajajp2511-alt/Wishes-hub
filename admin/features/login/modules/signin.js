/**
 * Wishes Hub - Sign-In Event Handler Module
 * Binds form submission events, handles input capture, and triggers core authentication.
 */

import { LoginCore } from '../login-core.js';

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

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            const captchaResponse = captchaInput ? captchaInput.value.trim() : null;

            // Basic frontend validation
            if (!email || !password) {
                this.showToast('Please enter both email and password.', 'error');
                return;
            }

            // Trigger Core Authentication Processing
            const result = await this.core.authenticateUser(email, password, captchaResponse);

            this.handleAuthResponse(result);
        });
    }

    handleAuthResponse(result) {
        switch (result.status) {
            case 'SUCCESS':
                this.showToast('Login successful! Redirecting to Admin Panel...', 'success');
                setTimeout(() => {
                    window.location.href = result.redirectUrl;
                }, 1000);
                break;

            case 'REDIRECT_USER':
                this.showToast(result.message, 'warning');
                setTimeout(() => {
                    window.location.href = result.redirectUrl;
                }, 1200);
                break;

            case 'REQUIRES_MFA':
                this.showToast('MFA verification required. Choose OTP channel.', 'info');
                // Trigger MFA/OTP module display here
                break;

            case 'ERROR':
            default:
                this.showToast(result.message || 'Authentication failed. Please try again.', 'error');
                break;
        }
    }

    showToast(message, type = 'info') {
        // Simple toast notification helper (can be styled via CSS)
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
