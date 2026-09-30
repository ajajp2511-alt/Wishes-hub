/**
 * Admin Login View Module with Rate Limiting & Brute-Force Guard (Wishes Hub)
 * Path: admin/features/auth/admin-login-view.js
 */

import { verifyAdminPassword } from '../auth-security/modules/auth-verifier.js';

export class AdminLoginView {
    constructor(onLoginSuccess) {
        this.onLoginSuccess = onLoginSuccess;
        this.maxAttempts = 5;
        this.lockoutTimeSec = 30;
    }

    getLockoutTimeRemaining() {
        const lockoutUntil = localStorage.getItem('wishes_hub_lockout_until');
        if (!lockoutUntil) return 0;
        const remaining = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000);
        return remaining > 0 ? remaining : 0;
    }

    render(container) {
        const remainingLockout = this.getLockoutTimeRemaining();
        const isLocked = remainingLockout > 0;

        container.innerHTML = `
            <div class="login-wrapper" style="display:flex; justify-content:center; align-items:center; min-height:80vh; background:#0d1117; color:#c9d1d9; font-family:sans-serif;">
                <div class="login-card" style="background:#161b22; padding:32px; border-radius:12px; border:1px solid #30363d; width:100%; max-width:400px; box-shadow:0 8px 24px rgba(0,0,0,0.5);">
                    
                    <div style="text-align:center; margin-bottom:24px;">
                        <h2 style="margin:0 0 8px; color:#f0f6fc; font-size:24px;">✨ Wishes Hub</h2>
                        <p style="margin:0; color:#8b949e; font-size:14px;">Admin Control Center Login</p>
                    </div>

                    <div id="login-error-alert" style="display:${isLocked ? 'block' : 'none'}; background:#f851491a; border:1px solid #f85149; color:#f85149; padding:10px 14px; border-radius:6px; font-size:13px; margin-bottom:16px;">
                        ${isLocked ? `Too many failed attempts. Try again in <span id="lockout-timer">${remainingLockout}</span>s` : ''}
                    </div>

                    <form id="admin-login-form" style="display:flex; flex-direction:column; gap:16px;">
                        <div>
                            <label style="display:block; font-size:13px; font-weight:600; margin-bottom:6px; color:#c9d1d9;">Admin Password / Key</label>
                            <div style="position:relative; display:flex; align-items:center;">
                                <input 
                                    type="password" 
                                    id="admin-password-input" 
                                    placeholder="Enter master admin password" 
                                    required 
                                    ${isLocked ? 'disabled' : ''}
                                    style="width:100%; padding:10px 40px 10px 12px; background:#0d1117; border:1px solid #30363d; border-radius:6px; color:#f0f6fc; font-size:14px; outline:none; ${isLocked ? 'opacity:0.6; cursor:not-allowed;' : ''}"
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
                                <input type="checkbox" id="remember-me-checkbox" style="accent-color:#238636;" ${isLocked ? 'disabled' : ''} /> Remember Session
                            </label>
                            <a href="#" id="forgot-pass-link" style="color:#58a6ff; text-decoration:none;">Forgot Key?</a>
                        </div>

                        <button 
                            type="submit" 
                            id="login-submit-btn" 
                            ${isLocked ? 'disabled' : ''}
                            style="background:${isLocked ? '#30363d' : '#238636'}; color:#ffffff; border:none; padding:10px; border-radius:6px; font-weight:600; font-size:14px; cursor:${isLocked ? 'not-allowed' : 'pointer'}; transition:background 0.2s;"
                        >
                            <span id="btn-text">${isLocked ? 'Locked Out ⏳' : 'Login to Dashboard'}</span>
                            <span id="btn-spinner" style="display:none;">Verifying... ⏳</span>
                        </button>
                    </form>

                    <div style="text-align:center; margin-top:20px; font-size:12px; color:#8b949e;">
                        Protected by Wishes Hub Security Shield 🛡️
                    </div>
                </div>
            </div>
        `;

        this.attachEvents(container);
        if (isLocked) this.startLockoutCountdown(container);
    }

    startLockoutCountdown(container) {
        const timerSpan = container.querySelector('#lockout-timer');
        const passwordInput = container.querySelector('#admin-password-input');
        const submitBtn = container.querySelector('#login-submit-btn');
        const btnText = container.querySelector('#btn-text');
        const errorAlert = container.querySelector('#login-error-alert');

        const interval = setInterval(() => {
            const remaining = this.getLockoutTimeRemaining();
            if (timerSpan) timerSpan.textContent = remaining;

            if (remaining <= 0) {
                clearInterval(interval);
                localStorage.removeItem('wishes_hub_lockout_until');
                localStorage.setItem('wishes_hub_failed_attempts', '0');
                
                errorAlert.style.display = 'none';
                passwordInput.disabled = false;
                passwordInput.style.opacity = '1';
                passwordInput.style.cursor = 'pointer';
                submitBtn.disabled = false;
                submitBtn.style.background = '#238636';
                submitBtn.style.cursor = 'pointer';
                btnText.textContent = 'Login to Dashboard';
            }
        }, 1000);
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

        if (!passwordInput.disabled) {
            setTimeout(() => passwordInput.focus(), 100);
        }

        toggleBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = '🔒';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        });

        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Emergency Recovery: Please check your environment variables or Vercel deployment settings for the master password.");
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this.getLockoutTimeRemaining() > 0) return;

            const password = passwordInput.value;
            errorAlert.style.display = 'none';
            errorAlert.textContent = '';
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';

            try {
                const result = await verifyAdminPassword(password);

                if (result.ok) {
                    localStorage.removeItem('wishes_hub_failed_attempts');
                    localStorage.removeItem('wishes_hub_lockout_until');

                    if (container.querySelector('#remember-me-checkbox').checked) {
                        localStorage.setItem('wishes_hub_admin_auth', 'active');
                    } else {
                        sessionStorage.setItem('wishes_hub_admin_auth', 'active');
                    }

                    if (this.onLoginSuccess) this.onLoginSuccess();
                } else {
                    let attempts = parseInt(localStorage.getItem('wishes_hub_failed_attempts') || '0', 10) + 1;
                    localStorage.setItem('wishes_hub_failed_attempts', attempts.toString());

                    if (attempts >= this.maxAttempts) {
                        const lockoutUntil = Date.now() + (this.lockoutTimeSec * 1000);
                        localStorage.setItem('wishes_hub_lockout_until', lockoutUntil.toString());
                        this.render(container);
                        return;
                    }

                    const remainingTries = this.maxAttempts - attempts;
                    errorAlert.textContent = `${result.error || "Invalid Password!"} (${remainingTries} attempts left)`;
                    errorAlert.style.display = 'block';
                    passwordInput.focus();
                }
            } catch (err) {
                errorAlert.textContent = "Connection error! Please check your network.";
                errorAlert.style.display = 'block';
            } finally {
                if (this.getLockoutTimeRemaining() <= 0) {
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline-block';
                    btnSpinner.style.display = 'none';
                }
            }
        });
    }
                                                      }
