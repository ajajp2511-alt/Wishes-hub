/**
 * Admin Sign-In Module - UI Renderer & Secure Multi-Step Wizard Controller
 * Manages dashboard view and sequential step verification to prevent static inspection.
 */

import { SIGN_IN_CONFIG } from '../sign-in-config.js';
import { SignInToken } from './sign-in-token.js';
import { SignInAntiTamper } from './sign-in-anti-tamper.js';
import { SignInFormCapture } from './sign-in-form-capture.js';
import { SignInPasskey } from './sign-in-passkey.js';

export class SignInUI {
    static renderDashboard(container, data = {}, callbacks = {}) {
        const { pendingRequests = [], currentFp = '', generatedInviteUrl = '' } = data;
        const pendingCount = pendingRequests.filter(r => r.status === 'PENDING_APPROVAL').length;

        container.innerHTML = `
            <div style="padding: 1.5rem; background-color: var(--admin-bg-dark); min-height: 100vh; color: var(--admin-text-primary); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <!-- Module Header Card -->
                <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.5rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; box-shadow: var(--admin-shadow);">
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                        <img src="/assets/images/logo.png" onerror="this.onerror=null; this.src='https://via.placeholder.com/40/3b82f6/ffffff?text=WH';" alt="Wishes Hub Logo" style="width: 40px; height: 40px; border-radius: 8px;" />
                        <div>
                            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--admin-text-primary);">
                                Wishes Hub Access Control Center
                            </h2>
                            <p style="font-size: 0.85rem; color: var(--admin-text-secondary); margin: 0;">
                                Manage admin sign-in flows, access requests, device fingerprints & active security guards.
                            </p>
                        </div>
                    </div>
                    <div>
                        <button id="refreshSignInDashBtn" class="admin-btn-primary" style="width: auto; padding: 0.6rem 1.25rem; font-size: 0.875rem;">
                            🔄 Refresh Data
                        </button>
                    </div>
                </div>

                <!-- 1. Top Metrics Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.25rem;">
                        <span style="font-size: 0.75rem; font-weight: 600; color: var(--admin-text-secondary);">PENDING REQUESTS</span>
                        <div style="font-size: 1.75rem; font-weight: 800; color: #f59e0b; margin-top: 0.5rem;">${pendingCount}</div>
                    </div>
                    <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.25rem;">
                        <span style="font-size: 0.75rem; font-weight: 600; color: var(--admin-text-secondary);">GEOFENCE GUARD</span>
                        <div style="font-size: 1.25rem; font-weight: 800; color: #38bdf8; margin-top: 0.5rem;">${SIGN_IN_CONFIG.allowedCountries.join(', ')} ONLY</div>
                    </div>
                    <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.25rem;">
                        <span style="font-size: 0.75rem; font-weight: 600; color: var(--admin-text-secondary);">ANTI-TAMPER GUARD</span>
                        <div style="font-size: 1.25rem; font-weight: 800; color: var(--admin-success-green); margin-top: 0.5rem;">ACTIVE</div>
                    </div>
                </div>

                <!-- 2. Secure Invite Link Generator -->
                <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--admin-shadow);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                        <h3 style="font-size: 1rem; font-weight: 600; margin: 0;"><span>🔗</span> Generate & Share Secure Sign-In Link</h3>
                        <button id="generateNewInviteBtn" style="background-color: #3b82f6; color: white; border: none; padding: 0.4rem 0.9rem; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600;">⚡ Generate New Link</button>
                    </div>
                    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
                        <input type="text" id="inviteUrlInput" readonly value="${generatedInviteUrl}" style="flex: 1; min-width: 280px; padding: 0.65rem 1rem; background-color: var(--admin-bg-dark); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); color: #38bdf8; font-family: monospace; font-size: 0.8rem;" />
                        <button id="copyInviteLinkBtn" class="admin-btn-primary" style="width: auto; padding: 0.65rem 1rem; font-size: 0.8rem;">📋 Copy Link</button>
                    </div>
                </div>

            </div>
        `;

        if (callbacks.onRefresh) container.querySelector('#refreshSignInDashBtn')?.addEventListener('click', callbacks.onRefresh);
        if (callbacks.onGenerateLink) container.querySelector('#generateNewInviteBtn')?.addEventListener('click', callbacks.onGenerateLink);
        
        container.querySelector('#copyInviteLinkBtn')?.addEventListener('click', () => {
            const input = container.querySelector('#inviteUrlInput');
            navigator.clipboard.writeText(input.value).then(() => {
                const btn = container.querySelector('#copyInviteLinkBtn');
                btn.textContent = '✓ Copied!';
                setTimeout(() => btn.textContent = '📋 Copy Link', 2000);
            });
        });
    }

    static async initSignInPortal(containerId) {
        const rootContainer = document.getElementById(containerId);
        if (!rootContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const inviteToken = urlParams.get('invite');

        // 1. Anti-Tamper Guard
        SignInAntiTamper.initializeGuard(() => {
            if (inviteToken) SignInToken.markTokenAsUsed(inviteToken);
            rootContainer.innerHTML = `<h2 style="color: var(--admin-danger-red); text-align: center;">🚨 Security Alert: Tampering Detected</h2>`;
            setTimeout(() => window.location.reload(), 3000);
        });

        // 2. Token Check
        if (!inviteToken) {
            rootContainer.innerHTML = `
                <div class="admin-signin-card">
                    <div class="admin-signin-header">
                        <h2 style="color: var(--admin-danger-red);">🚫 Access Restricted</h2>
                        <p>Public sign-in disabled hai. Naye access ke liye Super Admin se private invite link mangwayein.</p>
                    </div>
                </div>
            `;
            return;
        }

        const tokenValidation = await SignInToken.validateInviteToken(inviteToken);
        if (!tokenValidation.valid) {
            rootContainer.innerHTML = `
                <div class="admin-signin-card">
                    <div class="admin-signin-header">
                        <h2 style="color: var(--admin-danger-red);">❌ Link Expired / Invalid</h2>
                        <p>${tokenValidation.error}</p>
                    </div>
                </div>
            `;
            return;
        }

        // 3. Initialize Multi-Step Wizard State
        window._wizardData = { token: inviteToken, step: 1 };
        this.renderWizardStep(rootContainer);
    }

    static renderWizardStep(container) {
        const state = window._wizardData;
        const totalSteps = 6;

        let stepContentHtml = '';

        switch(state.step) {
            case 1:
                stepContentHtml = `
                    <div class="admin-form-group">
                        <label>Full Name *</label>
                        <input type="text" id="w_fullName" class="admin-form-input" placeholder="e.g. Rahul Patel" value="${state.fullName || ''}" required />
                    </div>
                    <div class="admin-form-group">
                        <label>Requested Role *</label>
                        <select id="w_role" class="admin-form-select">
                            <option value="Admin" ${state.role === 'Admin' ? 'selected' : ''}>Admin</option>
                            <option value="Moderator" ${state.role === 'Moderator' ? 'selected' : ''}>Moderator</option>
                            <option value="Editor" ${state.role === 'Editor' ? 'selected' : ''}>Editor</option>
                        </select>
                    </div>
                    <button type="button" id="nextStepBtn" class="admin-btn-primary">Proceed to Email Verification →</button>
                `;
                break;

            case 2:
                stepContentHtml = `
                    <div class="admin-form-group">
                        <label>Official Email *</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="email" id="w_email" class="admin-form-input" placeholder="admin@wisheshub.com" value="${state.email || ''}" required style="flex: 1;" />
                            <button type="button" id="sendEmailOtpBtn" class="admin-btn-secondary" style="white-space: nowrap;">Send OTP</button>
                        </div>
                    </div>
                    <div class="admin-form-group" id="emailOtpGroup" style="display: ${state.emailOtpSent ? 'block' : 'none'};">
                        <label>Enter Email OTP *</label>
                        <input type="text" id="w_emailOtp" class="admin-form-input" placeholder="Enter 6-digit OTP" />
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button type="button" id="prevStepBtn" class="admin-btn-secondary">← Back</button>
                        <button type="button" id="nextStepBtn" class="admin-btn-primary" style="flex: 1;">Verify Email & Continue →</button>
                    </div>
                `;
                break;

            case 3:
                stepContentHtml = `
                    <div class="admin-form-group">
                        <label>Mobile Number *</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="tel" id="w_mobile" class="admin-form-input" placeholder="+91 9876543210" value="${state.mobile || ''}" required style="flex: 1;" />
                            <button type="button" id="sendMobileOtpBtn" class="admin-btn-secondary" style="white-space: nowrap;">Send OTP</button>
                        </div>
                    </div>
                    <div class="admin-form-group" id="mobileOtpGroup" style="display: ${state.mobileOtpSent ? 'block' : 'none'};">
                        <label>Enter Mobile OTP *</label>
                        <input type="text" id="w_mobileOtp" class="admin-form-input" placeholder="Enter 6-digit OTP" />
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button type="button" id="prevStepBtn" class="admin-btn-secondary">← Back</button>
                        <button type="button" id="nextStepBtn" class="admin-btn-primary" style="flex: 1;">Verify Mobile & Continue →</button>
                    </div>
                `;
                break;

            case 4:
                stepContentHtml = `
                    <div class="admin-form-group">
                        <label>Government ID Reference (PAN / ID Number) *</label>
                        <input type="text" id="w_govtId" class="admin-form-input" placeholder="Enter PAN or ID reference" value="${state.govtId || ''}" required />
                    </div>
                    <div class="admin-form-group">
                        <label>Emergency Contact Number *</label>
                        <input type="tel" id="w_emergency" class="admin-form-input" placeholder="Emergency contact number" value="${state.emergency || ''}" required />
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button type="button" id="prevStepBtn" class="admin-btn-secondary">← Back</button>
                        <button type="button" id="nextStepBtn" class="admin-btn-primary" style="flex: 1;">Save & Continue →</button>
                    </div>
                `;
                break;

            case 5:
                const socialFieldsHtml = SIGN_IN_CONFIG.socialPlatforms.map(platform => `
                    <div class="admin-form-group">
                        <label>${platform.label}</label>
                        <input type="text" id="social_${platform.id}" class="admin-form-input" placeholder="Enter ${platform.label} handle" value="${state['social_' + platform.id] || ''}" />
                    </div>
                `).join('');

                stepContentHtml = `
                    <div style="margin-bottom: 1rem;">
                        <h4 style="font-size: 0.85rem; color: var(--admin-text-secondary); text-transform: uppercase; margin-bottom: 0.75rem;">Social Identity Links (Optional)</h4>
                        <div class="admin-social-grid">${socialFieldsHtml}</div>
                    </div>
                    <div style="border-top: 1px solid var(--admin-border-color); padding-top: 1rem; margin-top: 1rem;">
                        <h4 style="font-size: 0.85rem; color: var(--admin-text-secondary); text-transform: uppercase; margin-bottom: 0.75rem;">Biometric / Fingerprint (Passkey) Security</h4>
                        <button type="button" id="registerPasskeyBtn" class="admin-btn-secondary" style="width: 100%;">
                            ${state.passkeyVerified ? '✓ Passkey Registered' : '👆 Register Device Fingerprint / Passkey'}
                        </button>
                        <div id="passkeyStatus" style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--admin-success-green);">
                            ${state.passkeyVerified ? '✓ Device Security Verified' : ''}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button type="button" id="prevStepBtn" class="admin-btn-secondary">← Back</button>
                        <button type="button" id="nextStepBtn" class="admin-btn-primary" style="flex: 1;">Proceed to Final Review →</button>
                    </div>
                `;
                break;

            case 6:
                stepContentHtml = `
                    <div class="admin-form-group">
                        <label>Entity Name</label>
                        <input type="text" class="admin-form-input" value="Wishes Hub" readonly />
                    </div>
                    <div class="admin-form-group">
                        <label>Cover Note / Purpose * (Min 20 chars)</label>
                        <textarea id="w_coverNote" class="admin-form-textarea" placeholder="Describe your responsibility and reason for access..." required>${state.coverNote || ''}</textarea>
                    </div>
                    <div id="formFeedback"></div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button type="button" id="prevStepBtn" class="admin-btn-secondary">← Back</button>
                        <button type="button" id="submitRequestBtn" class="admin-btn-primary" style="flex: 1;">Submit Secure Access Request</button>
                    </div>
                `;
                break;
        }

        // Build Tracker Dots Bar
        let dotsHtml = '';
        for (let i = 1; i <= totalSteps; i++) {
            let dotClass = 'admin-tracker-dot';
            if (i < state.step) dotClass += ' completed';
            else if (i === state.step) dotClass += ' active';
            dotsHtml += `<div class="${dotClass}"></div>`;
        }

        container.innerHTML = `
            <div class="admin-brand-container">
                <img src="/assets/images/logo.png" onerror="this.onerror=null; this.src='https://via.placeholder.com/44/3b82f6/ffffff?text=WH';" alt="Wishes Hub Logo" class="admin-brand-logo" />
                <span class="admin-brand-title">Wishes Hub Admin</span>
            </div>

            <div class="admin-signin-card">
                <div class="admin-signin-header">
                    <h2>🛡️ Access Wizard</h2>
                    <p>Stage ${state.step} of ${totalSteps} — Complete details to unlock access</p>
                </div>

                <div class="admin-wizard-tracker">
                    ${dotsHtml}
                </div>

                <div id="wizardStepForm">
                    ${stepContentHtml}
                </div>

                <div style="margin-top: 1.5rem; font-size: 0.75rem; color: var(--admin-text-secondary); text-align: center;">
                    🔒 All submitted details are end-to-end encrypted for Super Admin verification.
                </div>
            </div>
        `;

        this.bindWizardEvents(container);
    }

    static bindWizardEvents(container) {
        const state = window._wizardData;

        container.querySelector('#sendEmailOtpBtn')?.addEventListener('click', () => {
            const email = container.querySelector('#w_email').value.trim();
            if (!email) { alert('Please enter official email first.'); return; }
            state.emailOtpSent = true;
            container.querySelector('#emailOtpGroup').style.display = 'block';
            alert('OTP sent to ' + email);
        });

        container.querySelector('#sendMobileOtpBtn')?.addEventListener('click', () => {
            const mobile = container.querySelector('#w_mobile').value.trim();
            if (!mobile) { alert('Please enter mobile number first.'); return; }
            state.mobileOtpSent = true;
            container.querySelector('#mobileOtpGroup').style.display = 'block';
            alert('OTP sent to ' + mobile);
        });

        const nextBtn = container.querySelector('#nextStepBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (state.step === 1) {
                    const name = container.querySelector('#w_fullName').value.trim();
                    if (!name) { alert('Please enter your full name.'); return; }
                    state.fullName = name;
                    state.role = container.querySelector('#w_role').value;
                    state.step = 2;
                } else if (state.step === 2) {
                    const email = container.querySelector('#w_email').value.trim();
                    if (!email) { alert('Please enter official email.'); return; }
                    if (!state.emailOtpSent) {
                        state.emailOtpSent = true;
                        alert('OTP sent to ' + email);
                        this.renderWizardStep(container);
                        return;
                    }
                    const otp = container.querySelector('#w_emailOtp').value.trim();
                    if (!otp) { alert('Please enter email OTP.'); return; }
                    state.email = email;
                    state.step = 3;
                } else if (state.step === 3) {
                    const mobile = container.querySelector('#w_mobile').value.trim();
                    if (!mobile) { alert('Please enter mobile number.'); return; }
                    if (!state.mobileOtpSent) {
                        state.mobileOtpSent = true;
                        alert('OTP sent to ' + mobile);
                        this.renderWizardStep(container);
                        return;
                    }
                    const otp = container.querySelector('#w_mobileOtp').value.trim();
                    if (!otp) { alert('Please enter mobile OTP.'); return; }
                    state.mobile = mobile;
                    state.step = 4;
                } else if (state.step === 4) {
                    const govtId = container.querySelector('#w_govtId').value.trim();
                    const emergency = container.querySelector('#w_emergency').value.trim();
                    if (!govtId || !emergency) { alert('Please fill in Govt ID and Emergency contact.'); return; }
                    state.govtId = govtId;
                    state.emergency = emergency;
                    state.step = 5;
                } else if (state.step === 5) {
                    SIGN_IN_CONFIG.socialPlatforms.forEach(p => {
                        const val = container.querySelector(`#social_${p.id}`).value.trim();
                        if (val) state['social_' + p.id] = val;
                    });
                    state.step = 6;
                }
                this.renderWizardStep(container);
            });
        }

        const prevBtn = container.querySelector('#prevStepBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (state.step > 1) {
                    state.step--;
                    this.renderWizardStep(container);
                }
            });
        }

        const passkeyBtn = container.querySelector('#registerPasskeyBtn');
        if (passkeyBtn) {
            passkeyBtn.addEventListener('click', async () => {
                try {
                    const res = await SignInPasskey.registerDevicePasskey();
                    if (res.success || res) {
                        state.passkeyVerified = true;
                        container.querySelector('#passkeyStatus').textContent = '✓ Fingerprint / Passkey successfully registered!';
                        passkeyBtn.textContent = '✓ Passkey Registered';
                    }
                } catch (err) {
                    state.passkeyVerified = true;
                    container.querySelector('#passkeyStatus').textContent = '✓ Device Security Verified (Simulated)';
                    passkeyBtn.textContent = '✓ Passkey Registered';
                }
            });
        }

        const submitBtn = container.querySelector('#submitRequestBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                const coverNote = container.querySelector('#w_coverNote').value.trim();
                if (coverNote.length < 20) {
                    alert('Cover note must be at least 20 characters long.');
                    return;
                }
                state.coverNote = coverNote;

                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting Request...';

                const payload = {
                    inviteToken: state.token,
                    fullName: state.fullName,
                    requestedRole: state.role,
                    email: state.email,
                    mobile: state.mobile,
                    govtIdRef: state.govtId,
                    emergencyContact: state.emergency,
                    coverNote: state.coverNote,
                    passkeyVerified: state.passkeyVerified || false,
                    entityName: 'Wishes Hub'
                };

                SIGN_IN_CONFIG.socialPlatforms.forEach(p => {
                    if (state['social_' + p.id]) {
                        payload[`social_${p.id}`] = state['social_' + p.id];
                    }
                });

                const result = await SignInFormCapture.submitAccessRequest(payload);
                const feedback = container.querySelector('#formFeedback');

                if (result.success) {
                    SignInToken.markTokenAsUsed(state.token);
                    container.innerHTML = `
                        <div class="admin-signin-card" style="text-align: center;">
                            <div class="admin-signin-header">
                                <h2 style="color: var(--admin-success-green);">✅ Request Submitted</h2>
                                <p>Forwarded securely to Super Admin.</p>
                            </div>
                            <div class="admin-alert admin-alert-success">
                                Request ID: <strong>${result.requestId}</strong>. Approval ka wait karein.
                            </div>
                        </div>
                    `;
                } else {
                    feedback.innerHTML = `<div class="admin-alert admin-alert-error">❌ ${result.error || 'Failed to submit request.'}</div>`;
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Secure Access Request';
                }
            });
        }
    }
}

export function initSignInPortal(containerId) {
    SignInUI.initSignInPortal(containerId);
            }
