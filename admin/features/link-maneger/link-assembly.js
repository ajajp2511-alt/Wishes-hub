/**
 * Main Assembly Controller - Link Manager
 * Path: admin/features/link-manager/link-assembly.js
 */

import { linkCoreInstance } from './link-core.js';
import { ShortLinksModule } from './modules/short-links.js';
import { UtmBuilderModule } from './modules/utm-builder.js';
import { RedirectRulesModule } from './modules/redirect-rules.js';
import { QrCodeGeneratorModule } from './modules/qr-code-generator.js';
import { LinkExpiryProtectionModule } from './modules/link-expiry-protection.js';
import { DeepLinkRouterModule } from './modules/deep-link-router.js';
import { ClickAnalyticsShieldModule } from './modules/click-analytics-shield.js';
import { LinkCloakerMaskingModule } from './modules/link-cloaker-masking.js';
import { AbDestinationSplitterModule } from './modules/ab-destination-splitter.js';
import { BulkLinkApiSyncModule } from './modules/bulk-link-api-sync.js';
import { PixelRetargetingEmbedderModule } from './modules/pixel-retargeting-embedder.js';
import { CustomDomainSuiteModule } from './modules/custom-domain-suite.js';

export class LinkAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'short-links';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="link-manager-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Link Manager & URL Routing Studio</h2>
          <small style="color:#6e7681;">Short Links, UTM Campaign Builder, Redirects & Retargeting Engine</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="short-links">Short Links</button>
          <button class="tab-btn" data-subtab="utm-builder">UTM Builder</button>
          <button class="tab-btn" data-subtab="redirect-rules">Redirect Rules</button>
          <button class="tab-btn" data-subtab="qr-generator">QR Generator</button>
          <button class="tab-btn" data-subtab="link-expiry">Link Expiry</button>
          <button class="tab-btn" data-subtab="deep-link">Deep Links</button>
          <button class="tab-btn" data-subtab="click-analytics">Click Analytics</button>
          <button class="tab-btn" data-subtab="link-cloaker">Link Cloaking</button>
          <button class="tab-btn" data-subtab="destination-splitter">Traffic Splitter</button>
          <button class="tab-btn" data-subtab="bulk-api">Bulk CSV & API</button>
          <button class="tab-btn" data-subtab="pixel-retargeting">Pixel Embedder</button>
          <button class="tab-btn" data-subtab="custom-domains">Custom Domains</button>
        </nav>

        <main id="link-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#link-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'short-links': ShortLinksModule.render(view, linkCoreInstance); break;
      case 'utm-builder': UtmBuilderModule.render(view); break;
      case 'redirect-rules': RedirectRulesModule.render(view, linkCoreInstance); break;
      case 'qr-generator': QrCodeGeneratorModule.render(view); break;
      case 'link-expiry': LinkExpiryProtectionModule.render(view); break;
      case 'deep-link': DeepLinkRouterModule.render(view); break;
      case 'click-analytics': ClickAnalyticsShieldModule.render(view); break;
      case 'link-cloaker': LinkCloakerMaskingModule.render(view); break;
      case 'destination-splitter': AbDestinationSplitterModule.render(view); break;
      case 'bulk-api': BulkLinkApiSyncModule.render(view); break;
      case 'pixel-retargeting': PixelRetargetingEmbedderModule.render(view); break;
      case 'custom-domains': CustomDomainSuiteModule.render(view); break;
      default: ShortLinksModule.render(view, linkCoreInstance); break;
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

export const linkAssemblyInstance = new LinkAssembly();
