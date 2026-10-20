/**
 * Admin Sign-In Module - UI Renderer
 * Generates professional dashboard markup leveraging sign-in.css variables and classes.
 */

import { SIGN_IN_CONFIG } from '../sign-in-config.js';

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
                        Naye admin ko add karne ke liye secure invite link generate karein. Yeh link bina valid token ke open nahi hogi.
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

        // Bind event listeners
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

        // Generate New Invite Link action
        const generateBtn = container.querySelector('#generateNewInviteBtn');
        if (generateBtn && callbacks.onGenerateLink) {
            generateBtn.addEventListener('click', () => {
                callbacks.onGenerateLink();
            });
        }

        // Copy Invite Link action
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

        // Share Invite Link action
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
}
