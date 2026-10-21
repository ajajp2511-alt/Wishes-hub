/**
 * Admin Sign-In Module - Dashboard Renderer & Router Controller
 * Manages dashboard view, token validation, and delegates wizard flow to dedicated controller.
 */

import { SIGN_IN_CONFIG } from '../sign-in-config.js';
import { SignInToken } from './sign-in-token.js';
import { SignInAntiTamper } from './sign-in-anti-tamper.js';
import { SignInWizardLogic } from './sign-in-wizard-logic.js';

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

        // 3. Initialize Multi-Step Wizard via Dedicated Logic Controller
        SignInWizardLogic.initWizard(rootContainer, inviteToken);
    }
}

export function initSignInPortal(containerId) {
    SignInUI.initSignInPortal(containerId);
}
