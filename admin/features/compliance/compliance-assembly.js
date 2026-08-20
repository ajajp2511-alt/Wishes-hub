/**
 * Main Assembly Controller - Compliance & Legal
 * Path: admin/features/compliance/compliance-assembly.js
 */

import { complianceCoreInstance } from './compliance-core.js';
import { GdprConsentModule } from './modules/gdpr-consent.js';
import { TermsCopyrightModule } from './modules/terms-copyright.js';
import { AbuseSpamProtectionModule } from './modules/abuse-spam-protection.js';
import { DataRetentionPurgeModule } from './modules/data-retention-purge.js';
import { DmcaTakedownDeskModule } from './modules/dmca-takedown-desk.js';
import { CookieConsentManagerModule } from './modules/cookie-consent-manager.js';
import { RegulatoryAuditTrailModule } from './modules/regulatory-audit-trail.js';
import { AgeVerificationCoppaModule } from './modules/age-verification-coppa.js';
import { VendorSubprocessorRegistryModule } from './modules/vendor-subprocessor-registry.js';
import { DisputeLegalNoticesModule } from './modules/dispute-legal-notices.js';

export class ComplianceAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'gdpr';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="compliance-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Compliance & Legal Center</h2>
          <small style="color:#6e7681;">GDPR Requests, Policy Rules, Content Moderation & Regulatory Compliance</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="gdpr">GDPR & Consent</button>
          <button class="tab-btn" data-subtab="terms">Terms & Copyright</button>
          <button class="tab-btn" data-subtab="abuse">Abuse & Spam</button>
          <button class="tab-btn" data-subtab="retention">Data Retention</button>
          <button class="tab-btn" data-subtab="dmca">DMCA Takedowns</button>
          <button class="tab-btn" data-subtab="cookies">Cookie Manager</button>
          <button class="tab-btn" data-subtab="audit">Compliance Audit</button>
          <button class="tab-btn" data-subtab="coppa">Minor Safety</button>
          <button class="tab-btn" data-subtab="vendors">Sub-Processors</button>
          <button class="tab-btn" data-subtab="disputes">Legal Notices</button>
        </nav>

        <main id="compliance-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#compliance-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'gdpr': GdprConsentModule.render(view, complianceCoreInstance); break;
      case 'terms': TermsCopyrightModule.render(view, complianceCoreInstance); break;
      case 'abuse': AbuseSpamProtectionModule.render(view, complianceCoreInstance); break;
      case 'retention': DataRetentionPurgeModule.render(view); break;
      case 'dmca': DmcaTakedownDeskModule.render(view); break;
      case 'cookies': CookieConsentManagerModule.render(view); break;
      case 'audit': RegulatoryAuditTrailModule.render(view); break;
      case 'coppa': AgeVerificationCoppaModule.render(view); break;
      case 'vendors': VendorSubprocessorRegistryModule.render(view); break;
      case 'disputes': DisputeLegalNoticesModule.render(view); break;
      default: GdprConsentModule.render(view, complianceCoreInstance); break;
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

export const complianceAssemblyInstance = new ComplianceAssembly();
