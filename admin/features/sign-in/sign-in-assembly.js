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
        if (rootId) {
            const root = document.getElementById(rootId);
            if (root) {
                root.innerHTML = `
                    <div style="padding: 20px;">
                        <h2>Sign In Dashboard</h2>
                        <p style="color: #888;">Sign-in module loaded successfully via Universal Smart Router.</p>
                    </div>
                `;
            }
        }

        SignInAntiTamper.initializeGuard((tamperErr) => {
            alert(tamperErr);
            window.location.reload();
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
