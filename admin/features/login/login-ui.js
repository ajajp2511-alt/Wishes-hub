/**
 * Wishes Hub - Login UI Controller
 * Manages DOM styling, password visibility toggles, loading animations, and interactive UI enhancements.
 */

import { LoginCore } from './login-core.js';

export class LoginUI {
    constructor() {
        this.loginCore = new LoginCore();
        this.initUIInteractions();
    }

    initUIInteractions() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }
    }

    setupUI() {
        this.initPasswordToggle();
        this.initInputAnimations();
        this.initFormSubmitHandler();
    }

    /**
     * Toggle password visibility (Show/Hide eye icon)
     */
    initPasswordToggle() {
        const passwordInput = document.getElementById('admin-password');
        if (!passwordInput) return;

        const wrapper = passwordInput.parentElement;
        if (wrapper && !document.getElementById('pwd-toggle-btn')) {
            wrapper.style.position = 'relative';

            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.id = 'pwd-toggle-btn';
            toggleBtn.className = 'password-toggle-icon';
            toggleBtn.innerHTML = '👁️';
            toggleBtn.title = 'Toggle password visibility';
            toggleBtn.style.cssText = `
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                padding: 0;
                opacity: 0.7;
                transition: opacity 0.2s;
                z-index: 10;
            `;

            toggleBtn.addEventListener('click', () => {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleBtn.innerHTML = '🔒';
                } else {
                    passwordInput.type = 'password';
                    toggleBtn.innerHTML = '👁';
                }
            });

            wrapper.appendChild(toggleBtn);
        }
    }

    /**
     * Add subtle focus/blur floating animations to input groups
     */
    initInputAnimations() {
        const inputs = document.querySelectorAll('.input-group input, .form-control');
        inputs.forEach(input => {
            if (input.value && input.parentElement) {
                input.parentElement.classList.add('focused');
            }

            input.addEventListener('focus', () => {
                if (input.parentElement) {
                    input.parentElement.classList.add('focused');
                }
            });

            input.addEventListener('blur', () => {
                if (!input.value && input.parentElement) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    /**
     * Handle Form Submission and Connect with LoginCore
     */
    initFormSubmitHandler() {
        const form = document.getElementById('login-form');
        const submitBtn = document.getElementById('login-submit-btn') || document.querySelector('#login-form button[type="submit"]');
        
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('admin-email');
            const passwordInput = document.getElementById('admin-password');

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

            // Set loading state on button
            if (submitBtn) {
                submitBtn.disabled = true;
                if (!submitBtn.dataset.originalText) {
                    submitBtn.dataset.originalText = submitBtn.textContent;
                }
                submitBtn.textContent = 'Authenticating...';
            }

            try {
                // Call LoginCore authentication flow
                const result = await this.loginCore.authenticateUser(email, password, null);

                if (result.status === 'ERROR') {
                    alert(result.message);
                } else if (result.status === 'SUCCESS' && result.redirectUrl) {
                    window.location.href = result.redirectUrl;
                }
            } catch (err) {
                console.error('Login Submission Error:', err);
                alert('An unexpected error occurred during login.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitBtn.dataset.originalText || 'Sign In to Dashboard';
                }
            }
        });
    }
}

// Initialize Login UI
new LoginUI();
