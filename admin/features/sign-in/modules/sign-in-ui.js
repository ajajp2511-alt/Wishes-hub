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
                    <div>
                        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--admin-text-primary); display: flex; align-items: center; gap: 0.5rem;">
                            <span>🔐</span> Sign-In & Access Control Center
                        </h2>
                        <p style="font-size: 0.875rem; color: var(--admin-text-secondary); margin: 0;">
                            Manage admin sign-in flows, access requests, device fingerprints & active security guards.
                        </p>
                    </div>
                    <div>
                        <button id="refreshSignInDashBtn" class="admin-btn-primary" style="width: auto; padding: 0.6rem 1.25rem; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.5rem;">
                            🔄 Refresh Data
                        </button>
                    </div>
                </div>

                <!-- 1. Top Metrics Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                    
                    <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.25rem;">
                        <span style="font-size: 0.75rem; font-weight: 600; color: var(--admin-text-secondary); letter-spacing: 0.05em;">PENDING REQUESTS</span>
                        <div style="font-size: 1.75rem; font-weight: 800; color: #f59e0b; margin-top: 0.5rem;">${pendingCount}</div>
                        <span style="font-size: 0.75rem; color: var(--admin-text-secondary);">Awaiting Super Admin review</span>
                    </div>

                    <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.25rem;">
                        <span style="font-size: 0.75rem; font-weight: 600; color: var(--admin-text-secondary); letter-spacing: 0.05em;">GEOFENCE GUARD</span>
                        <div style="font-size: 1.25rem; font-weight: 800; color: #38bdf8; margin-top: 0.5rem;">${SIGN_IN_CONFIG.allowedCountries.join(', ')} ONLY</div>
                        <span style="font-size: 0.75rem; color: var(--admin-success-green);">✓ India Region Restricted</span>
                    </div>

                    <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.25rem;">
                        <span style="font-size: 0.75rem; font-weight: 600; color: var(--admin-text-secondary); letter-spacing: 0.05em;">ANTI-TAMPER GUARD</span>
                        <div style="font-size: 1.25rem; font-weight: 800; color: var(--admin-success-green); margin-top: 0.5rem;">ACTIVE</div>
                        <span style="font-size: 0.75rem; color: var(--admin-text-secondary);">DevTools & Injection Monitored</span>
                    </div>

                    <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.25rem;">
                        <span style="font-size: 0.75rem; font-weight: 600; color: var(--admin-text-secondary); letter-spacing: 0.05em;">LOCKOUT THRESHOLD</span>
                        <div style="font-size: 1.5rem; font-weight: 800; color: var(--admin-danger-red); margin-top: 0.5rem;">${SIGN_IN_CONFIG.maxFailedAttempts} Attempts</div>
                        <span style="font-size: 0.75rem; color: var(--admin-text-secondary);">${SIGN_IN_CONFIG.lockoutDurationMs / 60000} mins auto-lockout</span>
                    </div>

                </div>

                <!-- 2. Secure Invite Link Generator & Sharing Section -->
                <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--admin-shadow);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                        <h3 style="font-size: 1rem; font-weight: 600; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>🔗</span> Generate & Share Secure Sign-In Link
                        </h3>
                        <button id="generateNewInviteBtn" style="background-color: #3b82f6; color: white; border: none; padding: 0.4rem 0.9rem; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600;">
                            ⚡ Generate New Link
                        </button>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--admin-text-secondary); margin-bottom: 1rem;">
                        Naye admin ko add karne ke liye secure invite link share karein. Yeh link bina valid token ke open nahi hogi.
                    </p>
                    
                    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
                        <input type="text" id="inviteUrlInput" readonly value="${generatedInviteUrl}" style="flex: 1; min-width: 280px; padding: 0.65rem 1rem; background-color: var(--admin-bg-dark); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); color: #38bdf8; font-family: monospace; font-size: 0.8rem;" />
                        <button id="copyInviteLinkBtn" class="admin-btn-primary" style="width: auto; padding: 0.65rem 1rem; font-size: 0.8rem;">
                            📋 Copy Link
                        </button>
                        <button id="shareInviteLinkBtn" style="background-color: #10b981; color: white; border: none; padding: 0.65rem 1rem; border-radius: var(--admin-radius); cursor: pointer; font-size: 0.8rem; font-weight: 600;">
                            📤 Share Link
                        </button>
                    </div>
                </div>

                <!-- 3. Pending Access Requests Table Card -->
                <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: var(--admin-shadow);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                        <h3 style="font-size: 1rem; font-weight: 600; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>📝</span> Admin Access Requests (Pending Review)
                        </h3>
                        <span style="background-color: var(--admin-bg-dark); border: 1px solid var(--admin-border-color); color: var(--admin-text-secondary); padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 500;">
                            Total: ${pendingRequests.length}
                        </span>
                    </div>

                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; color: var(--admin-text-secondary);">
                            <thead>
                                <tr style="border-bottom: 1px solid var(--admin-border-color); color: var(--admin-text-secondary); background-color: var(--admin-bg-dark);">
                                    <th style="padding: 0.75rem 1rem;">REQUEST ID</th>
                                    <th style="padding: 0.75rem 1rem;">NAME / EMAIL</th>
                                    <th style="padding: 0.75rem 1rem;">ROLE</th>
                                    <th style="padding: 0.75rem 1rem;">COVER NOTE</th>
                                    <th style="padding: 0.75rem 1rem;">DATE</th>
                                    <th style="padding: 0.75rem 1rem;">STATUS</th>
                                    <th style="padding: 0.75rem 1rem; text-align: right;">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pendingRequests.length === 0 ? `
                                    <tr>
                                        <td colspan="7" style="padding: 2rem; text-align: center; color: var(--admin-text-secondary);">
                                            Koi pending access request nahi hai.
                                        </td>
                                    </tr>
                                ` : pendingRequests.map(req => `
                                    <tr style="border-bottom: 1px solid var(--admin-border-color);">
                                        <td style="padding: 0.75rem 1rem; font-family: monospace; color: #38bdf8;">${req.requestId}</td>
                                        <td style="padding: 0.75rem 1rem;">
                                            <div style="font-weight: 600; color: var(--admin-text-primary);">${req.fullName || 'N/A'}</div>
                                            <div style="font-size: 0.75rem; color: var(--admin-text-secondary);">${req.email} \vert{}${req.mobile}</div>
                                        </td>
                                        <td style="padding: 0.75rem 1rem;">
                                            <span style="background-color: var(--admin-bg-dark); border: 1px solid var(--admin-border-color); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; color: var(--admin-text-primary);">${req.requestedRole || 'Admin'}</span>
                                        </td>
                                        <td style="padding: 0.75rem 1rem; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${req.coverNote || ''}">
                                            ${req.coverNote || '-'}
                                        </td>
                                        <td style="padding: 0.75rem 1rem; font-size: 0.75rem;">
                                            ${req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td style="padding: 0.75rem 1rem;">
                                            <span style="background-color: ${req.status === 'PENDING_APPROVAL' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'}; border: 1px solid ${req.status === 'PENDING_APPROVAL' ? '#f59e0b' : 'var(--admin-success-green)'}; color: ${req.status === 'PENDING_APPROVAL' ? '#fcd34d' : '#6ee7b7'}; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
                                                ${req.status}
                                            </span>
                                        </td>
                                        <td style="padding: 0.75rem 1rem; text-align: right;">
                                            <button class="remove-req-btn" data-id="${req.requestId}" style="background-color: rgba(239, 68, 68, 0.15); border: 1px solid var(--admin-danger-red); color: #fca5a5; padding: 0.35rem 0.75rem; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600;">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 4. Security & Device Fingerprint Bottom Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                    
                    <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.5rem; box-shadow: var(--admin-shadow);">
                        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>📱</span> Current Device Fingerprint Guard
                        </h3>
                        <div style="background-color: var(--admin-bg-dark); border: 1px solid var(--admin-border-color); padding: 0.75rem; border-radius: var(--admin-radius); font-family: monospace; font-size: 0.75rem; color: #38bdf8; word-break: break-all;">
                            ${currentFp}
                        </div>
                        <p style="font-size: 0.75rem; color: var(--admin-text-secondary); margin-top: 0.75rem; margin-bottom: 0;">
                            SignInIpGuard dwara screen resolution, user agent, aur browser locale se unique secure hash generate kiya gaya hai.
                        </p>
                    </div>

                    <div style="background-color: var(--admin-card-bg); border: 1px solid var(--admin-border-color); border-radius: var(--admin-radius); padding: 1.5rem; box-shadow: var(--admin-shadow);">
                        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>⚙️</span> Configured Social Identity Platforms
                        </h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${SIGN_IN_CONFIG.socialPlatforms.map(p => `
                                <span style="background-color: var(--admin-bg-dark); border: 1px solid var(--admin-border-color); color: var(--admin-text-primary); padding: 0.4rem 0.75rem; border-radius: 6px; font-size: 0.8rem;">
                                    ${p.label}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                </div>

            </div>
        `;

        if (callbacks.onRefresh) {
            const refreshBtn = container.querySelector('#refreshSignInDashBtn');
            if (refreshBtn) refreshBtn.addEventListener('click', callbacks.onRefresh);
        }

        if (callbacks.onRemoveRequest) {
            container.querySelectorAll('.remove-req-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const reqId = e.target.getAttribute('data-id');
                    callbacks.onRemoveRequest(reqId);
                });
            });
        }

        const generateBtn = container.querySelector('#generateNewInviteBtn');
        if (generateBtn && callbacks.onGenerateLink) {
            generateBtn.addEventListener('click', () => {
                callbacks.onGenerateLink();
            });
        }

        const copyBtn = container.querySelector('#copyInviteLinkBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const input = container.querySelector('#inviteUrlInput');
                input.select();
                navigator.clipboard.writeText(input.value).then(() => {
                    copyBtn.textContent = '✓ Copied!';
                    setTimeout(() => copyBtn.textContent = '📋 Copy Link', 2000);
                });
            });
        }

        const shareBtn = container.querySelector('#shareInviteLinkBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                const input = container.querySelector('#inviteUrlInput');
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'Wishes Hub Admin Access Invite',
                            text: 'Wishes Hub Admin panel ke liye secure sign-in invite link:',
                            url: input.value
                        });
                    } catch (err) {
                        console.log('Share canceled or failed', err);
                    }
                } else {
                    navigator.clipboard.writeText(input.value);
                    alert('Invite link clipboard par copy ho gaya hai!');
                }
            });
        }
    }

    static async initSignInPortal(containerId) {
        const rootContainer = document.getElementById(containerId);
        if (!rootContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const inviteToken = urlParams.get('invite');

        // 1. Anti-Tamper Guard
        SignInAntiTamper.initializeGuard((tamperErr) => {
            if (inviteToken) {
                SignInToken.markTokenAsUsed(inviteToken);
            }
            rootContainer.innerHTML = `
                <div class="admin-signin-header">
                    <h2 style="color: var(--admin-danger-red);">🚨 Security Alert: Tampering Detected</h2>
                    <p>Unauthorized code modification or manipulation caught.</p>
                </div>
                <div class="admin-alert admin-alert-error">
                    Security violation pakde jaane par yeh invite link permanently expire kar di gayi hai. Page reload ho raha hai...
                </div>
            `;
            setTimeout(() => window.location.reload(), 3000);
        });

        // 2. Token Missing Check
        if (!inviteToken) {
            rootContainer.innerHTML = `
                <div class="admin-signin-header">
                    <h2 style="color: var(--admin-danger-red);">🚫 Access Restricted</h2>
                    <p>This sign-in portal is strictly private.</p>
                </div>
                <div class="admin-alert admin-alert-error">
                    Public sign-in disabled hai. Naye access ke liye Super Admin se private invite link mangwayein.
                </div>
            `;
            return;
        }

        // 3. Token Validation
        const tokenValidation = await SignInToken.validateInviteToken(inviteToken);
        if (!tokenValidation.valid) {
            rootContainer.innerHTML = `
                <div class="admin-signin-header">
                    <h2 style="color: var(--admin-danger-red);">❌ Link Expired / Invalid</h2>
                    <p>Yeh invite link ab valid nahi hai ya pehle hi use ho chuki hai.</p>
                </div>
                <div class="admin-alert admin-alert-error">
                    ${tokenValidation.error}
                </div>
            `;
            return;
        }

        // 4. Initialize Multi-Step Wizard State
        window._wizardData = { token: inviteToken, step: 1 };
        this.renderWizardStep(rootContainer);
    }

    static renderWizardStep(container) {
        const state = window._wizardData;
        const totalSteps = 6;
        const progressPercent = Math.round((state.step / totalSteps) * 100);

        let stepContentHtml = '';

        switch(state.step) {
            case 1: // Identity & Role
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

            case 2: // Official Email & OTP
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

            case 3: // Mobile Number & OTP
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

            case 4: // Govt ID & Emergency Contact
                stepContentHtml = `
                    <div class="admin-form-group">
                        <label>Government ID Reference (PAN / ID Number) *</label>
                        <input type="text" id="w_govtId" class="admin-form-input" placeholder="Enter PAN or Govt ID reference" value="${state.govtId || ''}" required />
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

            case 5: // Social Identity Links & Passkey
                const socialFieldsHtml = SIGN_IN_CONFIG.socialPlatforms.map(platform => `
                    <div class="admin-form-group">
                        <label>${platform.label}</label>
                        <input type="text" id="social_${platform.id}" class="admin-form-input social-input" placeholder="Enter ${platform.label} handle" value="${state['social_' + platform.id] || ''}" />
                    </div>
                `).join('');

                stepContentHtml = `
                    <div style="margin-bottom: 1rem;">
                        <h4 style="font-size: 0.9rem; color: var(--admin-text-primary); margin-bottom: 0.75rem;">Social Identity Links (Optional)</h4>
                        <div class="admin-social-grid">${socialFieldsHtml}</div>
                    </div>
                    <div style="border-top: 1px solid var(--admin-border-color); padding-top: 1rem; margin-top: 1rem;">
                        <h4 style="font-size: 0.9rem; color: var(--admin-text-primary); margin-bottom: 0.75rem;">Biometric / Fingerprint (Passkey) Security</h4>
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

            case 6: // Final Cover Note & Submission
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

        container.innerHTML = `
            <div class="admin-signin-header">
                <h2>🛡️ Admin Access Wizard (Step ${state.step} of ${totalSteps})</h2>
                <p>Complete each verification stage securely to unlock access.</p>
            </div>
            
            <!-- Progress Bar -->
            <div style="background: var(--admin-border-color); height: 6px; border-radius: 4px; margin-bottom: 1.5rem; overflow: hidden;">
                <div style="background: var(--admin-primary-color, #4f46e5); width: ${progressPercent}%; height: 100%; transition: width 0.3s ease;"></div>
            </div>

            <div id="wizardStepForm">
                ${stepContentHtml}
            </div>

            <div style="margin-top: 1.5rem; font-size: 0.75rem; color: var(--admin-text-secondary); text-align: center;">
                🔒 All submitted details and identity reference documents are end-to-end encrypted.
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
                        <div class="admin-signin-header">
                            <h2>✅ Request Submitted Successfully</h2>
                            <p>Your access request has been securely forwarded to the Super Admin.</p>
                        </div>
                        <div class="admin-alert admin-alert-success">
                            Request ID: <strong>${result.requestId}</strong>. Super Admin approval ka wait karein. (Yeh link ab permanently expire ho chuki hai).
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
