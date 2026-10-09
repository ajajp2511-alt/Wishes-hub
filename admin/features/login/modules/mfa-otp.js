/**
 * Wishes Hub - MFA OTP Module
 * Handles OTP generation, countdown timer, resend logic, and verification flow via Render Backend.
 */

import { LoginConfig } from '../login-config.js';

export class MfaOtpModule {
    constructor(onVerificationSuccess) {
        this.onVerificationSuccess = onVerificationSuccess;
        this.timerInterval = null;
        this.email = '';
    }

    /**
     * Render MFA verification modal on screen (OTP is already sent by /verify-pass)
     */
    renderMfaModal(userId, channel = 'email') {
        this.email = userId; // userId yahan email hai
        let modal = document.getElementById('mfa-otp-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'mfa-otp-modal';
            modal.className = 'modal-overlay active';
            modal.innerHTML = `
                <div class="modal-card">
                    <h3>Two-Factor Authentication 🔐</h3>
                    <p>Enter the 6-digit OTP sent to your registered <span id="mfa-channel-name">${channel}</span> (<strong style="color: #4f46e5;">${userId}</strong>).</p>
                    
                    <form id="mfa-form">
                        <div class="input-group">
                            <input type="text" id="otp-input" maxlength="6" inputmode="numeric" pattern="[0-9]*" required placeholder="Enter 6-digit OTP" autocomplete="one-time-code" autofocus>
                        </div>
                        <div class="otp-timer-box">
                            Resend OTP in <span id="otp-countdown">60</span>s
                        </div>
                        <div class="modal-actions">
                            <button type="button" id="resend-otp-btn" class="btn-secondary" disabled>Resend OTP</button>
                            <button type="submit" id="verify-otp-btn" class="btn-primary">Verify & Sign In</button>
                        </div>
                        <div id="mfa-error-msg" style="color: #dc2626; font-size: 13px; margin-top: 10px; display: none; text-align: center;"></div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
            this.bindMfaEvents(userId);
        } else {
            document.getElementById('mfa-channel-name').textContent = channel;
            modal.classList.add('active');
            const inputField = document.getElementById('otp-input');
            if (inputField) inputField.value = '';
        }

        // 🚀 Do NOT trigger duplicate OTP here because /verify-pass already sent it successfully!
        this.startOtpTimer();
    }

    bindMfaEvents(userId) {
        const mfaForm = document.getElementById('mfa-form');
        const resendBtn = document.getElementById('resend-otp-btn');
        const otpInput = document.getElementById('otp-input');

        // Restrict input to digits only
        if (otpInput) {
            otpInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        mfaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const otpCode = otpInput ? otpInput.value.trim() : '';

            if (otpCode.length !== 6) {
                this.showError('Please enter a valid 6-digit OTP.');
                return;
            }

            await this.verifyOtp(userId, otpCode);
        });

        resendBtn.addEventListener('click', async () => {
            resendBtn.disabled = true;
            await this.resendOtp(userId, false);
            this.startOtpTimer();
        });
    }

    startOtpTimer() {
        let timeLeft = 60;
        const countdownEl = document.getElementById('otp-countdown');
        const resendBtn = document.getElementById('resend-otp-btn');

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        if (resendBtn) resendBtn.disabled = true;

        this.timerInterval = setInterval(() => {
            timeLeft--;
            if (countdownEl) countdownEl.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
                if (resendBtn) resendBtn.disabled = false;
            }
        }, 1000);
    }

    async verifyOtp(userId, code) {
        const verifyBtn = document.getElementById('verify-otp-btn');
        const errorDiv = document.getElementById('mfa-error-msg');
        
        try {
            if (verifyBtn) {
                verifyBtn.disabled = true;
                verifyBtn.dataset.originalText = verifyBtn.textContent;
                verifyBtn.textContent = 'Verifying...';
            }
            if (errorDiv) errorDiv.style.display = 'none';

            // 🔍 POST Request to Render Backend API endpoint
            const response = await fetch(LoginConfig.endpoints.verifyOtp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userId, otp: code })
            });

            const result = await response.json();

            if (!response.ok || !result.ok) {
                throw new Error(result.error || 'Invalid OTP code entered.');
            }

            // Success Flow
            if (this.timerInterval) clearInterval(this.timerInterval);
            const modal = document.getElementById('mfa-otp-modal');
            if (modal) modal.remove();
            
            if (this.onVerificationSuccess) this.onVerificationSuccess(result);

        } catch (error) {
            console.error('OTP Verification Error:', error);
            this.showError(error.message || 'Verification failed. Please try again.');
        } finally {
            if (verifyBtn) {
                verifyBtn.disabled = false;
                verifyBtn.textContent = verifyBtn.dataset.originalText || 'Verify & Sign In';
            }
        }
    }

    async resendOtp(userId, isInitial = false) {
        try {
            const response = await fetch(LoginConfig.endpoints.sendOtpEmail, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userId })
            });

            const result = await response.json();

            if (!response.ok || !result.ok) {
                throw new Error(result.error || 'Failed to send OTP.');
            }

            if (!isInitial) {
                alert('A new OTP has been sent to your email.');
            } else {
                console.log('[OTP] Initial OTP generated and sent successfully.');
            }
        } catch (error) {
            console.error('Send/Resend OTP Error:', error);
            if (!isInitial) {
                alert('❌ ' + error.message);
            }
        }
    }

    showError(msg) {
        const errorDiv = document.getElementById('mfa-error-msg');
        if (errorDiv) {
            errorDiv.innerText = msg;
            errorDiv.style.display = 'block';
        }
    }
}
