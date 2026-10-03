/**
 * Wishes Hub - MFA OTP Module
 * Handles OTP generation, countdown timer, resend logic, and verification flow.
 */

export class MfaOtpModule {
    constructor(onVerificationSuccess) {
        this.onVerificationSuccess = onVerificationSuccess;
        this.timerInterval = null;
    }

    /**
     * Render MFA verification modal on screen
     */
    renderMfaModal(userId, channel = 'email') {
        let modal = document.getElementById('mfa-otp-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'mfa-otp-modal';
            modal.className = 'modal-overlay active';
            modal.innerHTML = `
                <div class="modal-card">
                    <h3>Two-Factor Authentication 🔐</h3>
                    <p>Enter the 6-digit OTP sent to your registered <span id="mfa-channel-name">${channel}</span>.</p>
                    
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
                alert('Please enter a valid 6-digit OTP.');
                return;
            }

            await this.verifyOtp(userId, otpCode);
        });

        resendBtn.addEventListener('click', async () => {
            resendBtn.disabled = true;
            await this.resendOtp(userId);
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
        
        try {
            if (verifyBtn) {
                verifyBtn.disabled = true;
                verifyBtn.dataset.originalText = verifyBtn.textContent;
                verifyBtn.textContent = 'Verifying...';
            }

            // Simulating API call for OTP verification
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Mock success condition
            if (code === '123456') {
                if (this.timerInterval) clearInterval(this.timerInterval);
                const modal = document.getElementById('mfa-otp-modal');
                if (modal) modal.remove();
                
                if (this.onVerificationSuccess) this.onVerificationSuccess();
            } else {
                alert('Invalid OTP code. Please try again.');
            }
        } catch (error) {
            console.error('OTP Verification Error:', error);
            alert('Verification failed. Please try again.');
        } finally {
            if (verifyBtn) {
                verifyBtn.disabled = false;
                verifyBtn.textContent = verifyBtn.dataset.originalText || 'Verify & Sign In';
            }
        }
    }

    async resendOtp(userId) {
        try {
            // Simulating resend request
            await new Promise((resolve) => setTimeout(resolve, 500));
            alert('New OTP has been sent successfully.');
        } catch (error) {
            console.error('Resend OTP Error:', error);
            alert('Failed to resend OTP.');
        }
    }
}
