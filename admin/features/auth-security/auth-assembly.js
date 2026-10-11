/**
 * Main Assembly Controller - Auth & Security (Dashboard Only)
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
    this.currentActiveModule = null; // Track current module for cleanup
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) {
      console.error(`AuthAssembly: Root container with ID '${rootId}' not found.`);
      return;
    }
    this.injectStyles();
    this.renderDashboard();
  }

  // Inject dynamic styles for tabs to guarantee active state visibility
  injectStyles() {
    if (document.getElementById('auth-assembly-styles')) return;
    const style = document.createElement('style');
    style.id = 'auth-assembly-styles';
    style.innerHTML = `
      .auth-container .tab-btn {
        background: #f6f8fa;
        border: 1px solid #e1e4e8;
        color: #24292e;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .auth-container .tab-btn:hover {
        background: #ebf0f4;
        border-color: #cbd6e2;
      }
      .auth-container .tab-btn.active {
        background: #0366d6 !important;
        color: #ffffff !important;
        border-color: #0366d6 !important;
        font-weight: 600;
      }
    `;
    document.head.appendChild(style);
  }

  renderDashboard() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="auth-container" style="padding:16px;">
        <header style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 style="margin:0; color:#24292e;">Auth & Security Control Center</h2>
            <small style="color:#586069;">RBAC Roles, API Vault, IP Whitelisting, MFA & Security Posture</small>
          </div>
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

    try {
      // Cleanup previous module if it has a destroy/cleanup lifecycle method
      if (this.currentActiveModule && typeof this.currentActiveModule.destroy === 'function') {
        this.currentActiveModule.destroy();
      }

      view.innerHTML = ''; // Clear container safely
      
      let moduleToRender = AdminRolesRbacModule; // Default fallback

      switch (this.activeSubTab) {
        case 'roles-rbac': moduleToRender = AdminRolesRbacModule; break;
        case 'api-secrets': moduleToRender = ApiKeysSecretsModule; break;
        case 'ip-whitelist': moduleToRender = IpWhitelistModule; break;
        case 'mfa': moduleToRender = MfaEnforcementModule; break;
        case 'sessions': moduleToRender = ActiveSessionsDeskModule; break;
        case 'brute-force': moduleToRender = BruteForceGuardModule; break;
        case 'anomaly': moduleToRender = SecurityAnomalyDetectorModule; break;
        case 'pass-policy': moduleToRender = PasswordPolicyManagerModule; break;
        case 'sso': moduleToRender = SsoSamlIntegrationModule; break;
        case 'audit': moduleToRender = VulnerabilitySecurityAuditModule; break;
      }

      this.currentActiveModule = moduleToRender;
      if (typeof moduleToRender.render === 'function') {
        moduleToRender.render(view, authCoreInstance);
      } else {
        throw new Error(`Module for '${this.activeSubTab}' does not implement a static render() method.`);
      }

    } catch (error) {
      console.error("Error rendering sub-tab:", error);
      view.innerHTML = `
        <div style="padding: 20px; background: #ffebe6; color: #de350b; border-radius: 6px; border: 1px solid #ffbdad;">
          <strong>Error Loading Module:</strong> Failed to render the selected security component. (${error.message})
        </div>
      `;
    }
  }

  attachDashboardEvents() {
    const navContainer = this.container.querySelector('nav');
    if (!navContainer) return;

    navContainer.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.tab-btn');
      if (!targetBtn) return;

      this.container.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
      });
      
      targetBtn.classList.add('active');
      this.activeSubTab = targetBtn.dataset.subtab;
      this.renderActiveSubTab();
    });
  }
}

export const authAssemblyInstance = new AuthAssembly();

export function init(rootId) {
  authAssemblyInstance.init(rootId);
  }
