/**
 * Main Assembly Controller - Community & Feedback
 * Path: admin/features/community-feedback/community-assembly.js
 */

import { communityCoreInstance } from './community-core.js';
import { UserWishRequestsModule } from './modules/user-wish-requests.js';
import { FeedbackSupportModule } from './modules/feedback-support.js';
import { CommentModerationModule } from './modules/comment-moderation.js';
import { CommunityVotingRoadmapModule } from './modules/community-voting-roadmap.js';
import { UgcShowcaseManagerModule } from './modules/ugc-showcase-manager.js';
import { AiSentimentAnalyzerModule } from './modules/ai-sentiment-analyzer.js';
import { ReputationBadgesEngineModule } from './modules/reputation-badges-engine.js';
import { AnnouncementsChangelogModule } from './modules/announcements-changelog.js';
import { PollsSurveysBuilderModule } from './modules/polls-surveys-builder.js';
import { AbuseLegalReportsModule } from './modules/abuse-legal-reports.js';
import { CommunityForumQaModule } from './modules/community-forum-qa.js';
import { FaqAutoReplyBotModule } from './modules/faq-auto-reply-bot.js';
import { VipCreatorStudioModule } from './modules/vip-creator-studio.js';
import { MultilingualFeedbackTranslatorModule } from './modules/multilingual-feedback-translator.js';
import { LiveFeedbackPopupsModule } from './modules/live-feedback-popups.js';
import { BetaTesterCircleModule } from './modules/beta-tester-circle.js';

export class CommunityAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'wish-requests';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="community-manager-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Community & Feedback Studio</h2>
          <small style="color:#6e7681;">Wish Requests, Support Desk, Moderation & Creator Network</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="wish-requests">Wish Requests</button>
          <button class="tab-btn" data-subtab="feedback-support">Support Desk</button>
          <button class="tab-btn" data-subtab="comment-moderation">Comment Moderation</button>
          <button class="tab-btn" data-subtab="voting-roadmap">Voting & Roadmap</button>
          <button class="tab-btn" data-subtab="ugc-showcase">UGC Showcase</button>
          <button class="tab-btn" data-subtab="sentiment-analyzer">AI Sentiment</button>
          <button class="tab-btn" data-subtab="reputation-badges">Creator Badges</button>
          <button class="tab-btn" data-subtab="announcements">Changelog</button>
          <button class="tab-btn" data-subtab="polls-surveys">Polls & Surveys</button>
          <button class="tab-btn" data-subtab="abuse-reports">Abuse & Legal</button>
          <button class="tab-btn" data-subtab="forum-qa">Community Q&A</button>
          <button class="tab-btn" data-subtab="faq-bot">FAQ & Support Bot</button>
          <button class="tab-btn" data-subtab="vip-studio">VIP Creator Studio</button>
          <button class="tab-btn" data-subtab="translator">Multilingual Support</button>
          <button class="tab-btn" data-subtab="feedback-popups">Exit Surveys</button>
          <button class="tab-btn" data-subtab="beta-circle">Beta Testers</button>
        </nav>

        <main id="community-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#community-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'wish-requests': UserWishRequestsModule.render(view, communityCoreInstance); break;
      case 'feedback-support': FeedbackSupportModule.render(view, communityCoreInstance); break;
      case 'comment-moderation': CommentModerationModule.render(view, communityCoreInstance); break;
      case 'voting-roadmap': CommunityVotingRoadmapModule.render(view); break;
      case 'ugc-showcase': UgcShowcaseManagerModule.render(view); break;
      case 'sentiment-analyzer': AiSentimentAnalyzerModule.render(view); break;
      case 'reputation-badges': ReputationBadgesEngineModule.render(view); break;
      case 'announcements': AnnouncementsChangelogModule.render(view); break;
      case 'polls-surveys': PollsSurveysBuilderModule.render(view); break;
      case 'abuse-reports': AbuseLegalReportsModule.render(view); break;
      case 'forum-qa': CommunityForumQaModule.render(view); break;
      case 'faq-bot': FaqAutoReplyBotModule.render(view); break;
      case 'vip-studio': VipCreatorStudioModule.render(view); break;
      case 'translator': MultilingualFeedbackTranslatorModule.render(view); break;
      case 'feedback-popups': LiveFeedbackPopupsModule.render(view); break;
      case 'beta-circle': BetaTesterCircleModule.render(view); break;
      default: UserWishRequestsModule.render(view, communityCoreInstance); break;
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

export const communityAssemblyInstance = new CommunityAssembly();
