/**
 * Admin Login View Module (Wishes Hub)
 * Path: admin/features/auth-security/modules/admin-login-view.js
 */

import { verifyAdminPassword } from './auth-verifier.js';

export class AdminLoginView {
    constructor(onLoginSuccess) {
        this.onLoginSuccess = onLoginSuccess; // Callback jab login successful ho jaye
    }

    render(container) {
        container.innerHTML = `
            <div class="login-wrapper" style="display:flex; justify-content:center; align-items:center; min-height:80vh; background:#0d1117; color:#c9d1d9; font-family:sans-serif;">
                <div class="login-card" style="background:#161b22; padding:32px; border-radius:12px; border:1px solid #30363d; width:100%; max-width:400px; box-shadow:0 8px 24px rgba(0,0,0,0.5);">
                    
                    <!-- Wishes Hub Branding -->
                    <div style="text-align:center; margin-bottom:24px;">
                        <h2 style="margin:0 0 8px; color:#f0f6fc; font-size:24px;">✨ Wishes Hub</h2>
                        <p style="margin:0; color:#8b949e; font-size:14px;">Admin Control Center Login</p>
                    </div>

                    <!-- Error Alert Box -->
                    <div id="login-error-alert" style="display:none; background:#f851491a; border:1px solid #f85149; color:#f85149; padding:10px 14px; border-radius:6px; font-size:13px; margin-bottom:16px;"></div>

                    <!-- Login Form -->
                    <form id="admin-login-form" style="display:flex; flex-direction:column; gap:16px;">
                        <div>
                            <label style="display:block; font-size:13px; font-weight:600; margin-bottom:6px; color:#c9d1d9;">Admin Password / Key</label>
                            <div style="position:relative; display:flex; align-items:center;">
                                <input 
                                    type="password" 
                                    id="admin-password-input" 
                                    placeholder="Enter master admin password" 
                                    required 
                                    style="width:100%; padding:10px 40px 10px 12px; background:#0d1117; border:1px solid #30363d; border-radius:6px; color:#f0f6fc; font-size:14px; outline:none;"
                                />
                                <button 
                                    type="button" 
                                    id="toggle-password-btn" 
                                    style="position:absolute; right:10px; background:none; border:none; color:#8b949e; cursor:pointer; font-size:14px;"
                                    title="Show/Hide Password"
                                >👁️</button>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px;">
                            <label style="display:flex; align-items:center; gap:6px; cursor:pointer; color:#8b949e;">
                                <input type="checkbox" id="remember-me-checkbox" style="accent-color:#238636;" /> Remember Session
                            </label>
                            <a href="#" id="forgot-pass-link" style="color:#58a6ff; text-decoration:none;">Forgot Key?</a>
                        </div>

                        <button 
                            type="submit" 
                            id="login-submit-btn" 
                            style="background:#238636; color:#ffffff; border:none; padding:10px; border-radius:6px; font-weight:600; font-size:14px; cursor:pointer; transition:background 0.2s;"
                        >
                            <span id="btn-text">Login to Dashboard</span>
                            <span id="btn-spinner" style="display:none;">Verifying... ⏳</span>
                        </button>
                    </form>

                    <!-- Footer Info -->
                    <div style="text-align:center; margin-top:20px; font-size:12px; color:#8b949e;">
                        Protected by Wishes Hub Security Shield 🛡️
                    </div>
                </div>
            </div>
        `;

        this.attachEvents(container);
    }

    attachEvents(container) {
        const form = container.querySelector('#admin-login-form');
        const passwordInput = container.querySelector('#admin-password-input');
        const toggleBtn = container.querySelector('#toggle-password-btn');
        const errorAlert = container.querySelector('#login-error-alert');
        const submitBtn = container.querySelector('#login-submit-btn');
        const btnText = container.querySelector('#btn-text');
        const btnSpinner = container.querySelector('#btn-spinner');
        const forgotLink = container.querySelector('#forgot-pass-link');

        // 1. Auto-Focus on load
        setTimeout(() => passwordInput.focus(), 100);

        // 2. Show / Hide Password Toggle
        toggleBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = '🔒';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        });

        // 3. Forgot Password Alert Handler
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Emergency Recovery: Please check your environment variables or Vercel deployment settings for the master password.");
        });

        // 4. Form Submit & Authentication Flow
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = passwordInput.value;

            // Clear errors & activate loading state
            errorAlert.style.display = 'none';
            errorAlert.textContent = '';
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';

            try {
                // Call verifier module
                const result = await verifyAdminPassword(password);

                if (result.ok) {
                    // Save session state
                    if (container.querySelector('#remember-me-checkbox').checked) {
                        localStorage.setItem('wishes_hub_admin_auth', 'active');
                    } else {
                        sessionStorage.setItem('wishes_hub_admin_auth', 'active');
                    }

                    // Trigger success callback to load main dashboard
                    if (this.onLoginSuccess) {
                        this.onLoginSuccess();
                    }
                } else {
                    // Show error message
                    errorAlert.textContent = result.error || "Access Denied: Invalid Password!";
                    errorAlert.style.display = 'block';
                    passwordInput.focus();
                }
            } catch (err) {
                errorAlert.textContent = "Connection error! Please check your network.";
                errorAlert.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                btnSpinner.style.display = 'none';
            }
        });
    }
    }
