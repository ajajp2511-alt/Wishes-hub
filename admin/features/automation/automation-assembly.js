/**
 * Central Assembly Controller & UI Binder
 * Path: admin/features/automation/automation-assembly.js
 * Description: Master controller that binds all sub-modules together, manages system orchestration,
 *              and provides a unified control interface for the admin dashboard.
 */

import { AUTOMATION_CONFIG } from './automation-config.js';
import { automationCore } from './automation-core.js';
import { automationCalendar } from './modules/automation-calendar.js';
import { automationAIContent } from './modules/automation-ai-content.js';
import { automationPersonalizer } from './modules/automation-personalizer.js';
import { automation3DRenderer } from './modules/automation-3d-renderer.js';
import { automationLogoOverlay } from './modules/automation-logo-overlay.js';
import { automationLeadCapture } from './modules/automation-lead-capture.js';
import { automationQRGenerator } from './modules/automation-qr-generator.js';
import { automationViralBranding } from './modules/automation-viral-branding.js';
import { automationSponsorAlert } from './modules/automation-sponsor-alert.js';
import { automationWAAnalytics } from './modules/automation-wa-analytics.js';
import { automationScratchCard } from './modules/automation-scratch-card.js';
import { automationStoryBuilder } from './modules/automation-story-builder.js';
import { automationViralUnlock } from './modules/automation-viral-unlock.js';
import { automationVoiceWishes } from './modules/automation-voice-wishes.js';
import { automationAudioSync } from './modules/automation-audio-sync.js';
import { automationFestiveGames } from './modules/automation-festive-games.js';
import { automationBannerBuilder } from './modules/automation-banner-builder.js';
import { automationPartnerReferral } from './modules/automation-partner-referral.js';
import { automationTranslator } from './modules/automation-translator.js';
import { automationContentGuard } from './modules/automation-content-guard.js';
import { automationPushAlerts } from './modules/automation-push-alerts.js';
import { automationSEO } from './modules/automation-seo.js';
import { automationTrends } from './modules/automation-trends.js';
import { automationPublisher } from './modules/automation-publisher.js';
import { automationCountdown } from './modules/automation-countdown.js';
import { automationAdLinker } from './modules/automation-ad-linker.js';
import { automationSocialShare } from './modules/automation-social-share.js';

export class AutomationAssemblyController {
  constructor() {
    this.config = AUTOMATION_CONFIG;
    this.core = automationCore;

    // Direct Sub-Module Registry
    this.modules = {
      calendar: automationCalendar,
      aiContent: automationAIContent,
      personalizer: automationPersonalizer,
      renderer3D: automation3DRenderer,
      logoOverlay: automationLogoOverlay,
      leadCapture: automationLeadCapture,
      qrGenerator: automationQRGenerator,
      viralBranding: automationViralBranding,
      sponsorAlert: automationSponsorAlert,
      waAnalytics: automationWAAnalytics,
      scratchCard: automationScratchCard,
      storyBuilder: automationStoryBuilder,
      viralUnlock: automationViralUnlock,
      voiceWishes: automationVoiceWishes,
      audioSync: automationAudioSync,
      festiveGames: automationFestiveGames,
      bannerBuilder: automationBannerBuilder,
      partnerReferral: automationPartnerReferral,
      translator: automationTranslator,
      contentGuard: automationContentGuard,
      pushAlerts: automationPushAlerts,
      seo: automationSEO,
      trends: automationTrends,
      publisher: automationPublisher,
      countdown: automationCountdown,
      adLinker: automationAdLinker,
      socialShare: automationSocialShare
    };
  }

  /**
   * Boot Entire Automation Module System
   */
  async boot() {
    const initResult = await this.core.initialize();
    
    if (initResult.success) {
      this.core.log('ASSEMBLY', 'Master Automation Assembly Controller successfully booted all 27 sub-modules.', 'SUCCESS');
    } else {
      this.core.log('ASSEMBLY', `Master boot error: ${initResult.error}`, 'ERROR');
    }

    return initResult;
  }

  /**
   * Complete Pipeline Execution for a New Festival Wish Campaign
   */
  executeFullCampaignPipeline({ festivalId, senderName, receiverName, customQuote, lang = 'hi', countryCode = 'IN', sponsorData = null }) {
    // Step 1: Input Validation & Content Guard
    const senderVal = this.modules.contentGuard.validateInput(senderName, 'Sender Name');
    const receiverVal = this.modules.contentGuard.validateInput(receiverName, 'Receiver Name');

    if (!senderVal.valid) return { success: false, error: senderVal.reason };
    if (!receiverVal.valid) return { success: false, error: receiverVal.reason };

    // Step 2: Content Generation & Translation
    const rawWish = customQuote || this.modules.aiContent.generateWish({ festivalId, lang }).text;
    const translatedWish = this.modules.translator.translateText(rawWish, lang);

    // Step 3: Personalization & Share Link Building
    const personalized = this.modules.personalizer.formatPersonalizedMessage({
      baseWish: translatedWish,
      senderName: senderVal.cleanText,
      receiverName: receiverVal.cleanText,
      festivalName: festivalId
    });

    const shareLink = this.modules.personalizer.generateShareableLink({
      festivalId,
      senderName: senderVal.cleanText,
      receiverName: receiverVal.cleanText,
      is3D: true
    });

    // Step 4: 3D Scene & Audio Configuration
    const scene3D = this.modules.renderer3D.build3DSceneMetadata(festivalId);
    const audioSync = this.modules.audioSync.buildSyncTimeline({ festivalId });

    // Step 5: Branding, Sponsor Logo Overlay & QR Generation
    const branding = this.modules.viralBranding.buildCoBrandingFooter({
      festivalName: festivalId,
      sponsorData,
      senderName: senderVal.cleanText
    });

    let logoOverlayConfig = null;
    let qrConfig = null;

    if (sponsorData) {
      logoOverlayConfig = this.modules.logoOverlay.generateOverlayConfig(sponsorData, 'Marketing');
      if (sponsorData.offerCoupon) {
        qrConfig = this.modules.qrGenerator.generateCouponQRData({
          businessName: sponsorData.businessName,
          couponCode: sponsorData.offerCoupon.code,
          discountText: sponsorData.offerCoupon.discountText,
          whatsappNumber: sponsorData.whatsappNumber
        });
      }
    }

    // Step 6: Social Share Broadcast Payload
    const socialSharePayload = this.modules.socialShare.generateShareChannels({
      shareLink,
      festivalName: festivalId,
      senderName: senderVal.cleanText
    });

    const assembledPipelineResult = {
      success: true,
      festivalId,
      personalized,
      shareLink,
      scene3D,
      audioSync,
      branding,
      logoOverlayConfig,
      qrConfig,
      socialSharePayload,
      executedAt: new Date().toISOString()
    };

    this.core.log('ASSEMBLY', `Executed full automation pipeline for ${festivalId}`, 'SUCCESS');
    return assembledPipelineResult;
  }
}

export const automationAssembly = new AutomationAssemblyController();
