/**
 * Wishes Hub - Admin Login UI Component
 * Renders the login form layout, theme toggle, password visibility, and DOM elements.
 */

export class LoginUI {
    constructor(containerId = 'login-container') {
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) {
            console.error('Login container element not found!');
            return;
        }

        this.container.innerHTML = `
            <div class="login-wrapper" data-theme="dark">
                <div class="login-card">
                    <!-- Theme Toggle Button -->
                    <div class="login-header-actions">
                        <button id="theme-toggle-btn" class="icon-btn" title="Toggle Theme">🌙</button>
                    </div>

                    <div class="login-logo-area">
                        <h2>Wishes Hub</h2>
                        <p>Admin Portal Authentication</p>
                    </div>

                    <form id="login-form" class="login-form">
                        <!-- Email / Identifier -->
                        <div class="input-group">
                            <label for="admin-email">Admin Email / Username</label>
                            <input type="email" id="admin-email" required placeholder="Enter admin email" autocomplete="email" autofocus>
                        </div>

                        <!-- Password -->
                        <div class="input-group password-group">
                            <label for="admin-password">Password</label>
                            <div class="password-input-wrapper">
                                <input type="password" id="admin-password" required placeholder="Enter password" autocomplete="current-password">
                                <button type="button" id="toggle-password-btn" class="toggle-pwd-btn">👁️</button>
                            </div>
                        </div>

                        <!-- Remember Me & Forgot Password -->
                        <div class="form-options">
                            <label class="checkbox-label">
                                <input type="checkbox" id="remember-me"> Remember this device
                            </label>
                            <a href="#" id="forgot-password-link" class="forgot-link">Forgot Password?</a>
                        </div>

                        <!-- Captcha Container (Hidden by default) -->
                        <div id="captcha-container" class="captcha-container hidden">
                            <span id="captcha-label">Solve Security Check</span>
                            <input type="text" id="captcha-input" placeholder="Enter answer">
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" id="login-submit-btn" class="btn-primary">
                            <span class="btn-text">Sign In</span>
                            <span class="spinner hidden">⏳</span>
                        </button>
                    </form>

                    <!-- Alternative Quick Login Options -->
                    <div class="login-alternatives">
                        <button type="button" id="passkey-login-btn" class="btn-secondary">🔑 Sign in with Passkey</button>
                    </div>

                    <!-- Maintenance Mode Banner (Hidden by default) -->
                    <div id="maintenance-banner" class="maintenance-banner hidden">
                        ⚠️ System is currently under maintenance mode. Logins restricted to Super Admin.
                    </div>
                </div>
            </div>
        `;

        this.bindUIEvents();
    }

    bindUIEvents() {
        // Password Show/Hide Toggle
        const pwdInput = document.getElementById('admin-password');
        const togglePwdBtn = document.getElementById('toggle-password-btn');
        if (togglePwdBtn && pwdInput) {
            togglePwdBtn.addEventListener('click', () => {
                const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
                pwdInput.setAttribute('type', type);
                togglePwdBtn.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });
        }

        // Theme Toggle
        const themeBtn = document.getElementById('theme-toggle-btn');
        const wrapper = this.container.querySelector('.login-wrapper');
        if (themeBtn && wrapper) {
            themeBtn.addEventListener('click', () => {
                const currentTheme = wrapper.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                wrapper.setAttribute('data-theme', newTheme);
                themeBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
            });
        }
    }
}
