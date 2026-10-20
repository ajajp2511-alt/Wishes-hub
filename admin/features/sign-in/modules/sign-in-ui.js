/**
 * Admin Sign-In Module - UI Renderer
 * Generates clean, professional HTML markup utilizing external CSS classes.
 */

import { SIGN_IN_CONFIG } from '../sign-in-config.js';

export class SignInUI {
    static renderDashboard(container, data = {}, callbacks = {}) {
        const { pendingRequests = [], currentFp = '' } = data;
        const pendingCount = pendingRequests.filter(r => r.status === 'PENDING_APPROVAL').length;

        container.innerHTML = `
            <div class="admin-dashboard-container">
                
                <!-- Module Header -->
                <div class="admin-header-card">
                    <div class="admin-header-info">
                        <h2><span class="icon">🔐</span> Sign-In & Access Control Center</h2>
                        <p>Manage admin sign-in flows, access requests, device fingerprints & active security guards.</p>
                    </div>
                    <div class="admin-header-actions">
                        <button id="refreshSignInDashBtn" class="btn btn-primary">
                            🔄 Refresh Data
                        </button>
                    </div>
                </div>

                <!-- 1. Top Metrics Cards -->
                <div class="admin-metrics-grid">
                    <div class="metric-card">
                        <span class="metric-title">PENDING REQUESTS</span>
                        <div class="metric-value warning">${pendingCount}</div>
                        <span class="metric-desc">Awaiting Super Admin review</span>
                    </div>

                    <div class="metric-card">
                        <span class="metric-title">GEOFENCE GUARD</span>
                        <div class="metric-value info">${SIGN_IN_CONFIG.allowedCountries.join(', ')} ONLY</div>
                        <span class="metric-desc success-text">✓ India Region Restricted</span>
                    </div>

                    <div class="metric-card">
                        <span class="metric-title">ANTI-TAMPER GUARD</span>
                        <div class="metric-value success">ACTIVE</div>
                        <span class="metric-desc">DevTools & Injection Monitored</span>
                    </div>

                    <div class="metric-card">
                        <span class="metric-title">LOCKOUT THRESHOLD</span>
                        <div class="metric-value danger">${SIGN_IN_CONFIG.maxFailedAttempts} Attempts</div>
                        <span class="metric-desc">${SIGN_IN_CONFIG.lockoutDurationMs / 60000} mins auto-lockout</span>
                    </div>
                </div>

                <!-- 2. Pending Access Requests Table -->
                <div class="admin-card">
                    <div class="card-header">
                        <h3><span>📝</span> Admin Access Requests (Pending Review)</h3>
                        <span class="badge badge-secondary">Total: ${pendingRequests.length}</span>
                    </div>

                    <div class="table-responsive">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>REQUEST ID</th>
                                    <th>NAME / EMAIL</th>
                                    <th>ROLE</th>
                                    <th>COVER NOTE</th>
                                    <th>DATE</th>
                                    <th>STATUS</th>
                                    <th class="text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pendingRequests.length === 0 ? `
                                    <tr>
                                        <td colspan="7" class="text-center text-muted">
                                            Koi pending access request nahi hai.
                                        </td>
                                    </tr>
                                ` : pendingRequests.map(req => `
                                    <tr>
                                        <td class="font-mono text-info">${req.requestId}</td>
                                        <td>
                                            <div class="font-semibold">${req.fullName || 'N/A'}</div>
                                            <div class="text-xs text-muted">${req.email} \vert{}${req.mobile}</div>
                                        </td>
                                        <td><span class="badge badge-dark">${req.requestedRole || 'Admin'}</span></td>
                                        <td class="text-truncate text-muted" title="${req.coverNote || ''}">
                                            ${req.coverNote || '-'}
                                        </td>
                                        <td class="text-muted text-xs">
                                            ${req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td>
                                            <span class="badge ${req.status === 'PENDING_APPROVAL' ? 'badge-warning' : 'badge-success'}">
                                                ${req.status}
                                            </span>
                                        </td>
                                        <td class="text-right">
                                            <button class="btn btn-sm btn-danger remove-req-btn" data-id="${req.requestId}">
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
                <div class="admin-grid-2col">
                    
                    <div class="admin-card">
                        <h3><span>📱</span> Current Device Fingerprint Guard</h3>
                        <div class="code-box font-mono">
                            ${currentFp}
                        </div>
                        <p class="text-xs text-muted mt-2">
                            SignInIpGuard dwara screen resolution, user agent, aur browser locale se hash generate kiya gaya hai.
                        </p>
                    </div>

                    <div class="admin-card">
                        <h3><span>⚙️</span> Configured Social Identity Platforms</h3>
                        <div class="tags-flex">
                            ${SIGN_IN_CONFIG.socialPlatforms.map(p => `
                                <span class="tag-chip">${p.label}</span>
                            `).join('')}
                        </div>
                    </div>

                </div>

            </div>
        `;

        // Attach event listeners via callbacks
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
    }
}
