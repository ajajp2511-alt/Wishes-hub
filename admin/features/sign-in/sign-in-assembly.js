/**
 * Admin Sign-In Module - Assembly Controller
 * Coordinates verification steps, sub-modules, and delegates UI rendering to SignInUI.
 */

import { signInCore } from './sign-in-core.js';
import { SIGN_IN_CONFIG } from './sign-in-config.js';
import { SignInUI } from './modules/sign-in-ui.js';
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
        this.currentStep = 'SIGN_IN';
    }

    init(rootId) {
        if (!rootId) return;
        const root = document.getElementById(rootId);
        if (!root) return;

        this.loadDashboardView(root, rootId);

        // Bind Anti-Tamper Guard
        SignInAntiTamper.initializeGuard((tamperErr) => {
            alert(tamperErr);
            window.location.reload();
        });
    }

    loadDashboardView(rootElement, rootId) {
        const pendingRequests = JSON.parse(localStorage.getItem('wishes_hub_admin_requests') || '[]');
        const currentFp = SignInIpGuard.getDeviceFingerprint();

        // Generate dynamic secure invite token pointing correctly via vercel rewrite rule
        const inviteToken = 'inv_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        const generatedInviteUrl = `${window.location.origin}/sign-in.html?invite=${inviteToken}`;

        SignInUI.renderDashboard(rootElement, {
            pendingRequests,
            currentFp,
            generatedInviteUrl
        }, {
            onRefresh: () => this.loadDashboardView(rootElement, rootId),
            onGenerateLink: () => this.loadDashboardView(rootElement, rootId),
            onRemoveRequest: (reqId) => {
                const existing = JSON.parse(localStorage.getItem('wishes_hub_admin_requests') || '[]');
                const updated = existing.filter(r => r.requestId !== reqId);
                localStorage.setItem('wishes_hub_admin_requests', JSON.stringify(updated));
                this.loadDashboardView(rootElement, rootId);
            }
        });
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
            const tokenCheck = await SignInToken.validateInviteToken(inviteToken);
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
