/**
 * Main Assembly Controller - Share Manager
 * Path: admin/features/share-manager/share-assembly.js
 */

import { shareCoreInstance } from './share-core.js';
import { WhatsappScriptsModule } from './modules/whatsapp-scripts.js';
import { SocialPreviewsModule } from './modules/social-previews.js';
import { EmbedWidgetsModule } from './modules/embed-widgets.js';
import { MultiPlatformRouterModule } from './modules/multi-platform-router.js';
import { DynamicPersonalizationModule } from './modules/dynamic-personalization.js';
import { ShareAnalyticsViralityModule } from './modules/share-analytics-virality.js';
import { AutoChannelPublisherModule } from './modules/auto-channel-publisher.js';
import { ShareGamificationRewardsModule } from './modules/share-gamification-rewards.js';
import { CopyPasteTrackerModule } from './modules/copy-paste-tracker.js';
import { QrShareBridgeModule } from './modules/qr-share-bridge.js';
import { StoryVideoGeneratorModule } from './modules/story-video-generator.js';
import { BulkContactInviterModule } from './modules/bulk-contact-inviter.js';
import { RegionalDialectSwitcherModule } from './modules/regional-dialect-switcher.js';
import { VoiceWishShareEngineModule } from './modules/voice-wish-share-engine.js';

export class ShareAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'whatsapp-scripts';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="share-manager-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Share Manager & Viral Distribution Studio</h2>
          <small style="color:#6e7681;">WhatsApp Scripts, Social Previews, Embeds & Virality Engine</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="whatsapp-scripts">WhatsApp Scripts</button>
          <button class="tab-btn" data-subtab="social-previews">Social Previews</button>
          <button class="tab-btn" data-subtab="embed-widgets">Embed Widgets</button>
          <button class="tab-btn" data-subtab="multi-platform">Multi-Platform Router</button>
          <button class="tab-btn" data-subtab="personalization">Personalization</button>
          <button class="tab-btn" data-subtab="share-analytics">Virality Analytics</button>
          <button class="tab-btn" data-subtab="auto-publisher">Channel Publisher</button>
          <button class="tab-btn" data-subtab="share-rewards">Share Rewards</button>
          <button class="tab-btn" data-subtab="copy-tracker">Copy Tracker</button>
          <button class="tab-btn" data-subtab="qr-bridge">QR Bridge</button>
          <button class="tab-btn" data-subtab="story-video">Story Video Exporter</button>
          <button class="tab-btn" data-subtab="bulk-inviter">Bulk Inviter</button>
          <button class="tab-btn" data-subtab="dialect-switcher">Regional Dialects</button>
          <button class="tab-btn" data-subtab="voice-engine">Voice Wishes</button>
        </nav>

        <main id="share-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#share-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'whatsapp-scripts': WhatsappScriptsModule.render(view, shareCoreInstance); break;
      case 'social-previews': SocialPreviewsModule.render(view); break;
      case 'embed-widgets': EmbedWidgetsModule.render(view); break;
      case 'multi-platform': MultiPlatformRouterModule.render(view); break;
      case 'personalization': DynamicPersonalizationModule.render(view); break;
      case 'share-analytics': ShareAnalyticsViralityModule.render(view, shareCoreInstance); break;
      case 'auto-publisher': AutoChannelPublisherModule.render(view); break;
      case 'share-rewards': ShareGamificationRewardsModule.render(view); break;
      case 'copy-tracker': CopyPasteTrackerModule.render(view); break;
      case 'qr-bridge': QrShareBridgeModule.render(view); break;
      case 'story-video': StoryVideoGeneratorModule.render(view); break;
      case 'bulk-inviter': BulkContactInviterModule.render(view); break;
      case 'dialect-switcher': RegionalDialectSwitcherModule.render(view); break;
      case 'voice-engine': VoiceWishShareEngineModule.render(view); break;
      default: WhatsappScriptsModule.render(view, shareCoreInstance); break;
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

export const shareAssemblyInstance = new ShareAssembly();
