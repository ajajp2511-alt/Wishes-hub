/**
 * Main Assembly Controller - Auth & Security (Integrated with Login & Router)
 * Path: admin/features/auth-security/auth-assembly.js
 */

import { authCoreInstance } from './auth-core.js';
import { AdminRolesRbacModule } from './modules/admin-roles-rbac.js';
import { ApiKeysSecretsModule } from './modules/api-keys-secrets.js';
import { IpWhitelistModule } from './modules/ip-whitelist.js';
import { MfaEnforcementModule } from './modules/mfa-enforcement.js';
import { ActiveSessionsDeskModule } from './modules/active-sessions-desk.js';
import { BruteForceGuardModule } from './modules/brute-force-guard.js';
import { SecurityAnomalyDetectorModule } from './modules/security-anomaly-detector.js';
import { PasswordPolicyManagerModule } from './modules/password-policy-manager.js';
import { SsoSamlIntegrationModule } from './modules/sso-saml-integration.js';
import { VulnerabilitySecurityAuditModule } from './modules/vulnerability-security-audit.js';

export class AuthAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'roles-rbac';
    
    // Login view instance with success callback
    this.loginView = new AdminLoginView(() => {
      this.renderDashboard();
    });
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    // Check karein ki admin already logged in hai ya nahi
    if (this.isLoggedIn()) {
      this.renderDashboard();
    } else {
      this.loginView.render(this.container);
    }
  }

  isLoggedIn() {
    return localStorage.getItem('wishes_hub_admin_auth') === 'active' || 
           sessionStorage.getItem('wishes_hub_admin_auth') === 'active';
  }

  renderDashboard() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="auth-container" style="padding:16px;">
        <header style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 style="margin:0; color:#f0f6fc;">Auth & Security Control Center</h2>
            <small style="color:#8b949e;">RBAC Roles, API Vault, IP Whitelisting, MFA & Security Posture</small>
          </div>
          <button id="admin-logout-btn" style="background:#f85149; color:#fff; border:none; padding:8px 14px; border-radius:6px; cursor:pointer; font-weight:600; font-size:13px; transition:background 0.2s;">Logout</button>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn ${this.activeSubTab === 'roles-rbac' ? 'active' : ''}" data-subtab="roles-rbac">Admin Roles & RBAC</button>
          <button class="tab-btn ${this.activeSubTab === 'api-secrets' ? 'active' : ''}" data-subtab="api-secrets">API Keys & Secrets</button>
          <button class="tab-btn ${this.activeSubTab === 'ip-whitelist' ? 'active' : ''}" data-subtab="ip-whitelist">IP Whitelist</button>
          <button class="tab-btn ${this.activeSubTab === 'mfa' ? 'active' : ''}" data-subtab="mfa">MFA Enforcement</button>
          <button class="tab-btn ${this.activeSubTab === 'sessions' ? 'active' : ''}" data-subtab="sessions">Active Sessions</button>
          <button class="tab-btn ${this.activeSubTab === 'brute-force' ? 'active' : ''}" data-subtab="brute-force">Brute-Force Guard</button>
          <button class="tab-btn ${this.activeSubTab === 'anomaly' ? 'active' : ''}" data-subtab="anomaly">Anomaly Detector</button>
          <button class="tab-btn ${this.activeSubTab === 'pass-policy' ? 'active' : ''}" data-subtab="pass-policy">Password Policy</button>
          <button class="tab-btn ${this.activeSubTab === 'sso' ? 'active' : ''}" data-subtab="sso">SSO / SAML</button>
          <button class="tab-btn ${this.activeSubTab === 'audit' ? 'active' : ''}" data-subtab="audit">Security Scorecard</button>
        </nav>

        <main id="auth-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
    this.attachDashboardEvents();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#auth-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'roles-rbac': AdminRolesRbacModule.render(view, authCoreInstance); break;
      case 'api-secrets': ApiKeysSecretsModule.render(view, authCoreInstance); break;
      case 'ip-whitelist': IpWhitelistModule.render(view, authCoreInstance); break;
      case 'mfa': MfaEnforcementModule.render(view, authCoreInstance); break;
      case 'sessions': ActiveSessionsDeskModule.render(view, authCoreInstance); break;
      case 'brute-force': BruteForceGuardModule.render(view, authCoreInstance); break;
      case 'anomaly': SecurityAnomalyDetectorModule.render(view, authCoreInstance); break;
      case 'pass-policy': PasswordPolicyManagerModule.render(view, authCoreInstance); break;
      case 'sso': SsoSamlIntegrationModule.render(view, authCoreInstance); break;
      case 'audit': VulnerabilitySecurityAuditModule.render(view, authCoreInstance); break;
      default: AdminRolesRbacModule.render(view, authCoreInstance); break;
    }
  }

  attachDashboardEvents() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.tab-btn');
        if (!targetBtn) return;

        this.container.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
        });
        
        targetBtn.classList.add('active');
        this.activeSubTab = targetBtn.dataset.subtab;
        this.renderActiveSubTab();
      });
    });

    const logoutBtn = this.container.querySelector('#admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('wishes_hub_admin_auth');
        sessionStorage.removeItem('wishes_hub_admin_auth');
        this.loginView.render(this.container);
      });
    }
  }

  async verifyPassword(password) {
    return await verifyAdminPassword(password);
  }
}

export const authAssemblyInstance = new AuthAssembly();

// Router safeRun compatibility ke liye direct export function
export function init(rootId) {
  authAssemblyInstance.init(rootId);
}
