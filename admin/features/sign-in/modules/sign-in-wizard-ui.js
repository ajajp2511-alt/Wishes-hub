/**
 * Admin Sign-In Wizard UI Renderer Module
 * File: admin/features/sign-in/modules/sign-in-wizard-ui.js
 */
import { SIGN_IN_CONFIG } from '../sign-in-config.js';

export class SignInWizardUI {
    static getStepContent(state) {
        switch(state.step) {
            case 1:
                return `
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
            case 2:
                return `
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
            case 3:
                return `
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
            case 4:
                return `
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
            case 5:
                const socialFieldsHtml = SIGN_IN_CONFIG.socialPlatforms.map(platform => `
                    <div class="admin-form-group">
                        <label>${platform.label}</label>
                        <input type="text" id="social_${platform.id}" class="admin-form-input" placeholder="Enter ${platform.label} handle" value="${state['social_' + platform.id] || ''}" />
                    </div>
                `).join('');

                return `
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
            case 6:
                return `
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
            default:
                return '';
        }
    }

    static renderWizardContainer(container, state, totalSteps = 6) {
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
                    ${this.getStepContent(state)}
                </div>

                <div style="margin-top: 1.5rem; font-size: 0.75rem; color: var(--admin-text-secondary); text-align: center;">
                    🔒 All submitted details are end-to-end encrypted for Super Admin verification.
                </div>
            </div>
        `;
    }
                                                                                       }
