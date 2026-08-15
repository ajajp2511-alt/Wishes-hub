/**
 * Main Assembly Controller - SEO & Traffic Growth
 * Path: admin/features/seo/seo-assembly.js
 */

import { seoCoreInstance } from './seo-core.js';
import { SitemapIndexingModule } from './modules/sitemap-indexing.js';
import { SchemaMicrodataModule } from './modules/schema-microdata.js';
import { DomainRoutingModule } from './modules/domain-routing.js';
import { MetaAutoGeneratorModule } from './modules/meta-auto-generator.js';
import { KeywordRankTrackerModule } from './modules/keyword-rank-tracker.js';
import { SocialOgPreviewModule } from './modules/social-og-preview.js';
import { ProgrammaticSeoModule } from './modules/programmatic-seo.js';
import { ContentAutoUpdaterModule } from './modules/content-auto-updater.js';
import { TechnicalSeoAuditorModule } from './modules/technical-seo-auditor.js';

export class SEOAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'sitemap-indexing';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="seo-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">SEO & Traffic Growth Studio</h2>
          <small style="color:#6e7681;">Sitemaps, Instant Indexing, Programmatic Pages & Rank Tracking</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="sitemap-indexing">Sitemap & Indexing</button>
          <button class="tab-btn" data-subtab="schema-microdata">Schema & Microdata</button>
          <button class="tab-btn" data-subtab="domain-routing">Domain & Routing</button>
          <button class="tab-btn" data-subtab="meta-generator">Meta AI Generator</button>
          <button class="tab-btn" data-subtab="rank-tracker">Keyword Rank Tracker</button>
          <button class="tab-btn" data-subtab="social-og">Social OG Preview</button>
          <button class="tab-btn" data-subtab="programmatic-seo">Programmatic SEO</button>
          <button class="tab-btn" data-subtab="auto-updater">Content Auto-Updater</button>
          <button class="tab-btn" data-subtab="seo-auditor">Technical SEO Auditor</button>
        </nav>

        <main id="seo-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#seo-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'sitemap-indexing': SitemapIndexingModule.render(view, seoCoreInstance); break;
      case 'schema-microdata': SchemaMicrodataModule.render(view); break;
      case 'domain-routing': DomainRoutingModule.render(view); break;
      case 'meta-generator': MetaAutoGeneratorModule.render(view); break;
      case 'rank-tracker': KeywordRankTrackerModule.render(view, seoCoreInstance); break;
      case 'social-og': SocialOgPreviewModule.render(view); break;
      case 'programmatic-seo': ProgrammaticSeoModule.render(view, seoCoreInstance); break;
      case 'auto-updater': ContentAutoUpdaterModule.render(view); break;
      case 'seo-auditor': TechnicalSeoAuditorModule.render(view); break;
      default: SitemapIndexingModule.render(view, seoCoreInstance); break;
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

export const seoAssemblyInstance = new SEOAssembly();
