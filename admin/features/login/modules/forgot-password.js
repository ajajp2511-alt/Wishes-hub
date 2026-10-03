/**
 * Wishes Hub - Forgot Password Module
 * Handles password recovery requests, reset link dispatch, and new password updates.
 */

import { LoginConfig } from '../login-config.js';

export class ForgotPasswordModule {
    constructor() {
        this.initListeners();
    }

    initListeners() {
        const forgotLink = document.getElementById('forgot-password-link');
        if (!forgotLink) return;

        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.renderForgotPasswordModal();
        });
    }

    renderForgotPasswordModal() {
        // Check if modal already exists, else create it
        let modal = document.getElementById('forgot-pwd-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'forgot-pwd-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-card">
                    <h3>Reset Admin Password</h3>
                    <p>Enter your registered admin email address to receive a password reset link.</p>
                    <form id="forgot-pwd-form">
                        <div class="input-group">
                            <label for="reset-email">Admin Email</label>
                            <input type="email" id="reset-email" required placeholder="Enter your email" autocomplete="email">
                        </div>
                        <div class="modal-actions">
                            <button type="button" id="close-modal-btn" class="btn-secondary">Cancel</button>
                            <button type="submit" id="send-reset-btn" class="btn-primary">Send Reset Link</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);

            // Bind modal action listeners
            document.getElementById('close-modal-btn').addEventListener('click', () => {
                modal.classList.remove('active');
            });

            document.getElementById('forgot-pwd-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('reset-email');
                const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
                
                if (!email) {
                    alert('Please enter a valid email address.');
                    return;
                }

                this.handlePasswordResetRequest(email, modal);
            });
        } else {
            modal.classList.add('active');
            const emailInput = document.getElementById('reset-email');
            if (emailInput) emailInput.value = '';
        }
    }

    async handlePasswordResetRequest(email, modalElement) {
        const submitBtn = document.getElementById('send-reset-btn');
        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                if (!submitBtn.dataset.originalText) {
                    submitBtn.dataset.originalText = submitBtn.textContent;
                }
                submitBtn.textContent = 'Sending...';
            }

            // Simulating API request for password reset
            // const response = await fetch(LoginConfig.endpoints.forgotPassword, { method: 'POST', body: JSON.stringify({ email }) });
            
            await new Promise((resolve) => setTimeout(resolve, 1000));

            alert(`Password reset instructions have been sent to ${email}`);
            modalElement.classList.remove('active');
        } catch (error) {
            console.error('Password Reset Error:', error);
            alert('Failed to send reset link. Please try again.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.dataset.originalText || 'Send Reset Link';
            }
        }
    }
}
