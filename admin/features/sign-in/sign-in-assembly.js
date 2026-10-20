/**
 * Admin Sign-In Module - Assembly Controller
 * Binds UI form inputs, coordinates verification steps, and manages authentication flows.
 */

import { signInCore } from './sign-in-core.js';
import { SIGN_IN_CONFIG } from './sign-in-config.js';
import { SignInFormCapture } from './modules/sign-in-form-capture.js';
import { SignInWhitelist } from './modules/sign-in-whitelist.js';
import { SignInCredentials } from './modules/sign-in-credentials.js';
import { SignInToken } from './modules/sign-in-token.js';
import { SignInMfa } from './modules/sign-in-mfa.js';
import { SignInPasskey } from './modules/sign-in-passkey.js';
import { SignInIpGuard } from './modules/sign-in-ip-guard.js';
import { SignInLockout } from './modules/sign-in-lockout.js';
import { SignInAntiTamper } from './modules/sign-in-anti-tamper.js';
import { SignInWebhook } from './modules/sign-in-webhook.js';

export class SignInAssembly {
    constructor(uiContainers = {}) {
        this.containers = uiContainers;
        this.currentStep = 'SIGN_IN'; // 'SIGN_IN' | 'REQUEST_FORM' | 'MFA_VERIFY'
    }

    init(rootId) {
        if (!rootId) return;
        const root = document.getElementById(rootId);
        if (!root) return;

        // Fetch requests from localStorage captured via SignInFormCapture
        const pendingRequests = JSON.parse(localStorage.getItem('wishes_hub_admin_requests') || '[]');
        const pendingCount = pendingRequests.filter(r => r.status === 'PENDING_APPROVAL').length;
        const currentFp = SignInIpGuard.getDeviceFingerprint();

        root.innerHTML = `
            <div style="padding: 24px; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                
                <!-- Module Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; background: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #1e293b;">
                    <div>
                        <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #f8fafc; display: flex; align-items: center; gap: 10px;">
                            <span>🔐</span> Sign-In & Access Control Center
                        </h2>
                        <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">Manage admin sign-in flows, access requests, device fingerprints & active security guards.</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button id="refreshSignInDashBtn" style="background: #3b82f6; border: none; color: white; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 6px;">
                            🔄 Refresh Data
                        </button>
                    </div>
                </div>

                <!-- 1. Top Metrics Cards -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
                    <div style="background: #1e293b; border: 1px solid #334155; padding: 18px; border-radius: 10px;">
                        <span style="color: #94a3b8; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">PENDING REQUESTS</span>
                        <div style="font-size: 28px; font-weight: 800; color: #f59e0b; margin-top: 8px;">${pendingCount}</div>
                        <span style="color: #cbd5e1; font-size: 11px;">Awaiting Super Admin review</span>
                    </div>

                    <div style="background: #1e293b; border: 1px solid #334155; padding: 18px; border-radius: 10px;">
                        <span style="color: #94a3b8; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">GEOFENCE GUARD</span>
                        <div style="font-size: 22px; font-weight: 800; color: #38bdf8; margin-top: 8px;">${SIGN_IN_CONFIG.allowedCountries.join(', ')} ONLY</div>
                        <span style="color: #22c55e; font-size: 11px;">✓ India Region Restricted</span>
                    </div>

                    <div style="background: #1e293b; border: 1px solid #334155; padding: 18px; border-radius: 10px;">
                        <span style="color: #94a3b8; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">ANTI-TAMPER GUARD</span>
                        <div style="font-size: 22px; font-weight: 800; color: #22c55e; margin-top: 8px;">ACTIVE</div>
                        <span style="color: #94a3b8; font-size: 11px;">DevTools & Injection Monitored</span>
                    </div>

                    <div style="background: #1e293b; border: 1px solid #334155; padding: 18px; border-radius: 10px;">
                        <span style="color: #94a3b8; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">LOCKOUT THRESHOLD</span>
                        <div style="font-size: 28px; font-weight: 800; color: #ef4444; margin-top: 8px;">${SIGN_IN_CONFIG.maxFailedAttempts} Attempts</div>
                        <span style="color: #94a3b8; font-size: 11px;">${SIGN_IN_CONFIG.lockoutDurationMs / 60000} mins auto-lockout</span>
                    </div>
                </div>

                <!-- 2. Pending Access Requests Table -->
                <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #f8fafc; display: flex; align-items: center; gap: 8px;">
                            <span>📝</span> Admin Access Requests (Pending Review)
                        </h3>
                        <span style="background: #334155; color: #cbd5e1; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                            Total: ${pendingRequests.length}
                        </span>
                    </div>

                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; color: #cbd5e1;">
                            <thead>
                                <tr style="border-bottom: 1px solid #334155; color: #94a3b8; background: #0f172a;">
                                    <th style="padding: 12px;">REQUEST ID</th>
                                    <th style="padding: 12px;">NAME / EMAIL</th>
                                    <th style="padding: 12px;">ROLE</th>
                                    <th style="padding: 12px;">COVER NOTE</th>
                                    <th style="padding: 12px;">DATE</th>
                                    <th style="padding: 12px;">STATUS</th>
                                    <th style="padding: 12px; text-align: right;">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pendingRequests.length === 0 ? `
                                    <tr>
                                        <td colspan="7" style="padding: 24px; text-align: center; color: #64748b;">
                                            Koi pending access request nahi hai.
                                        </td>
                                    </tr>
                                ` : pendingRequests.map(req => `
                                    <tr style="border-bottom: 1px solid #334155;">
                                        <td style="padding: 12px; font-family: monospace; color: #38bdf8;">${req.requestId}</td>
                                        <td style="padding: 12px;">
                                            <div style="font-weight: 600; color: #f8fafc;">${req.fullName || 'N/A'}</div>
                                            <div style="font-size: 11px; color: #94a3b8;">${req.email} \vert{}${req.mobile}</div>
                                        </td>
                                        <td style="padding: 12px;"><span style="background: #334155; padding: 3px 8px; border-radius: 4px; font-size: 11px;">${req.requestedRole || 'Admin'}</span></td>
                                        <td style="padding: 12px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #94a3b8;">
                                            ${req.coverNote || '-'}
                                        </td>
                                        <td style="padding: 12px; color: #94a3b8; font-size: 12px;">
                                            ${req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td style="padding: 12px;">
                                            <span style="background: ${req.status === 'PENDING_APPROVAL' ? '#78350f' : '#14532d'}; color: ${req.status === 'PENDING_APPROVAL' ? '#fcd34d' : '#86efac'}; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                                                ${req.status}
                                            </span>
                                        </td>
                                        <td style="padding: 12px; text-align: right;">
                                            <button onclick="window.clearAccessRequest('${req.requestId}')" style="background: #7f1d1d; color: #fca5a5; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 11px;">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- 3. Active Security Rules & Device Fingerprint -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    
                    <div style="background: #1e293b; border: 1px solid #334155; padding: 20px; border-radius: 12px;">
                        <h3 style="margin: 0 0 16px 0; font-size: 15px; color: #f8fafc; display: flex; align-items: center; gap: 8px;">
                            <span>📱</span> Current Device Fingerprint Guard
                        </h3>
                        <div style="background: #0f172a; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #38bdf8; word-break: break-all; border: 1px solid #334155;">
                            ${currentFp}
                        </div>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8;">
                            `SignInIpGuard` dwara screen resolution, user agent, aur browser locale se hash generate kiya gaya hai.
                        </p>
                    </div>

                    <div style="background: #1e293b; border: 1px solid #334155; padding: 20px; border-radius: 12px;">
                        <h3 style="margin: 0 0 16px 0; font-size: 15px; color: #f8fafc; display: flex; align-items: center; gap: 8px;">
                            <span>⚙️</span> Configured Social Identity Platforms
                        </h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${SIGN_IN_CONFIG.socialPlatforms.map(p => `
                                <span style="background: #0f172a; border: 1px solid #334155; color: #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px;">
                                    ${p.label}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                </div>

            </div>
        `;

        // Bind Anti-Tamper Guard
        SignInAntiTamper.initializeGuard((tamperErr) => {
            alert(tamperErr);
            window.location.reload();
        });

        // Event listener for Refresh button
        const refreshBtn = document.getElementById('refreshSignInDashBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.init(rootId));
        }

        // Global handler for removing requests
        window.clearAccessRequest = (reqId) => {
            const existing = JSON.parse(localStorage.getItem('wishes_hub_admin_requests') || '[]');
            const updated = existing.filter(r => r.requestId !== reqId);
            localStorage.setItem('wishes_hub_admin_requests', JSON.stringify(updated));
            this.init(rootId);
        };
    }

    async handleAccessRequestSubmit(formElement) {
        const requestData = SignInFormCapture.collectFormData(formElement);
        const result = await SignInFormCapture.submitAccessRequest(requestData);

        if (result.success) {
            await SignInWebhook.notifySuperAdmin('NEW_ADMIN_REQUEST', requestData);
        }

        return result;
    }

    async handleSignInAttempt(identifier, password, inviteToken = null) {
        // 1. Lockout Check
        const lockout = SignInLockout.getLockoutState(identifier);
        if (lockout.isLocked) {
            return { success: false, error: `${lockout.reason} (${lockout.remainingMinutes} mins baki hain)` };
        }

        // 2. Super Admin Whitelist Check
        const whitelistCheck = await SignInWhitelist.verifyPermission(identifier);
        if (!whitelistCheck.isAllowed) {
            return { success: false, error: whitelistCheck.reason };
        }

        // 3. Credentials Check
        const credCheck = await SignInCredentials.verify(identifier, password);
        if (!credCheck.success) {
            SignInLockout.registerFailedAttempt(identifier);
            return credCheck;
        }

        // 4. Invite Token Check if mandatory
        if (inviteToken) {
            const tokenCheck = await SignInToken.validateInviteToken(inviteToken, identifier);
            if (!tokenCheck.valid) {
                return { success: false, error: tokenCheck.error };
            }
        }

        // 5. Environment & IP Verification
        const envCheck = await SignInIpGuard.verifyAccessEnvironment(whitelistCheck.adminData);
        if (!envCheck.isAllowed) {
            return { success: false, error: envCheck.error };
        }

        SignInLockout.clearLockout(identifier);
        return {
            success: true,
            requiresMfa: true,
            adminData: whitelistCheck.adminData
        };
    }

    async completeMfaAuth(adminData, totpCode) {
        const mfaResult = await SignInMfa.verifyTotpCode(adminData.id, totpCode);
        if (mfaResult.success) {
            signInCore.saveSession(adminData, mfaResult.mfaToken);
            return { success: true, redirectUrl: SIGN_IN_CONFIG.routes.adminDashboard };
        }
        return mfaResult;
    }
}

export const signInAssemblyInstance = new SignInAssembly();

export function init(rootId, name) {
    signInAssemblyInstance.init(rootId, name);
}
