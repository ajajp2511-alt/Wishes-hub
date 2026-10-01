// admin/features/login/login-view.js

export const LoginView = {
    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const currentHour = new Date().getHours();
        let greeting = "Welcome Back, Admin";
        if (currentHour < 12) greeting = "Good Morning, Admin";
        else if (currentHour < 17) greeting = "Good Afternoon, Admin";
        else greeting = "Good Evening, Admin";

        container.innerHTML = `
            <div class="login-wrapper">
                <div class="login-card">
                    <div class="brand-header">
                        <h2>Patel Studio</h2>
                        <p class="greeting-text">${greeting}</p>
                        <span class="security-badge">🔒 Enterprise Secure Portal</span>
                    </div>

                    <form id="adminLoginForm" novalidate>
                        <div class="input-group">
                            <label for="adminUser">Username or Email</label>
                            <input type="text" id="adminUser" required autocomplete="username" placeholder="Enter admin ID">
                        </div>

                        <div class="input-group password-group">
                            <label for="adminPass">Password</label>
                            <div class="pass-wrapper">
                                <input type="password" id="adminPass" required autocomplete="current-password" placeholder="••••••••••••">
                                <button type="button" id="togglePassBtn" class="toggle-pass" aria-label="Toggle password">👁️</button>
                            </div>
                            <div id="strengthMeter" class="strength-meter"><span></span></div>
                        </div>

                        <div class="form-options">
                            <label class="remember-me">
                                <input type="checkbox" id="rememberMe"> Remember Device
                            </label>
                            <a href="#" id="forgotPassLink" class="forgot-link">Forgot Password?</a>
                        </div>

                        <button type="submit" id="loginSubmitBtn" class="primary-btn">
                            <span class="btn-text">Sign In securely</span>
                            <span class="spinner" style="display:none;">⏳</span>
                        </button>
                    </form>

                    <div class="extra-actions">
                        <button type="button" id="backToWebBtn" class="secondary-link-btn">
                            ← Back to Main Website
                        </button>
                    </div>

                    <div class="login-footer">
                        <p>Protected by Patel Studio Security Shield</p>
                    </div>
                </div>
            </div>
        `;
    }
};
