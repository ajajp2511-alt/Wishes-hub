/**
 * Wishes Hub - Login UI Controller
 * Manages DOM styling, password visibility toggles, loading animations, and interactive UI enhancements.
 */

export class LoginUI {
    constructor() {
        this.initUIInteractions();
    }

    initUIInteractions() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initPasswordToggle();
            this.initInputAnimations();
            this.enhanceButtons();
        });
    }

    /**
     * Toggle password visibility (Show/Hide eye icon)
     */
    initPasswordToggle() {
        const passwordInput = document.getElementById('admin-password');
        if (!passwordInput) return;

        // Create toggle button container if not present
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
            `;

            toggleBtn.addEventListener('click', () => {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleBtn.innerHTML = '🔒';
                } else {
                    passwordInput.type = 'password';
                    toggleBtn.innerHTML = '👁️';
                }
            });

            wrapper.appendChild(toggleBtn);
        }
    }

    /**
     * Add subtle focus/blur floating animations to input groups
     */
    initInputAnimations() {
        const inputs = document.querySelectorAll('.input-group input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    /**
     * Add smooth ripple or loading state effect to submit buttons
     */
    enhanceButtons() {
        const submitBtn = document.getElementById('signin-submit-btn');
        if (!submitBtn) return;

        submitBtn.addEventListener('click', () => {
            const form = document.getElementById('admin-login-form');
            if (form && form.checkValidity()) {
                submitBtn.classList.add('btn-loading');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Authenticating...';
            }
        });
    }
}

// Initialize Login UI
new LoginUI();
