/**
 * Main Assembly Controller - Auth & Security
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
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="auth-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Auth & Security Control Center</h2>
          <small style="color:#6e7681;">RBAC Roles, API Vault, IP Whitelisting, MFA & Security Posture</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="roles-rbac">Admin Roles & RBAC</button>
          <button class="tab-btn" data-subtab="api-secrets">API Keys & Secrets</button>
          <button class="tab-btn" data-subtab="ip-whitelist">IP Whitelist</button>
          <button class="tab-btn" data-subtab="mfa">MFA Enforcement</button>
          <button class="tab-btn" data-subtab="sessions">Active Sessions</button>
          <button class="tab-btn" data-subtab="brute-force">Brute-Force Guard</button>
          <button class="tab-btn" data-subtab="anomaly">Anomaly Detector</button>
          <button class="tab-btn" data-subtab="pass-policy">Password Policy</button>
          <button class="tab-btn" data-subtab="sso">SSO / SAML</button>
          <button class="tab-btn" data-subtab="audit">Security Scorecard</button>
        </nav>

        <main id="auth-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#auth-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'roles-rbac': AdminRolesRbacModule.render(view, authCoreInstance); break;
      case 'api-secrets': ApiKeysSecretsModule.render(view, authCoreInstance); break;
      case 'ip-whitelist': IpWhitelistModule.render(view, authCoreInstance); break;
      case 'mfa': MfaEnforcementModule.render(view); break;
      case 'sessions': ActiveSessionsDeskModule.render(view); break;
      case 'brute-force': BruteForceGuardModule.render(view); break;
      case 'anomaly': SecurityAnomalyDetectorModule.render(view); break;
      case 'pass-policy': PasswordPolicyManagerModule.render(view); break;
      case 'sso': SsoSamlIntegrationModule.render(view); break;
      case 'audit': VulnerabilitySecurityAuditModule.render(view); break;
      default: AdminRolesRbacModule.render(view, authCoreInstance); break;
    }
  }

  attachEventListeners() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.style.fontWeight = 'normal';
        });
        
        e.target.classList.add('active');
        e.target.style.fontWeight = 'bold';
        
        this.activeSubTab = e.target.dataset.subtab;
        this.renderActiveSubTab();
      });
    });
  }
}

export const authAssemblyInstance = new AuthAssembly();
