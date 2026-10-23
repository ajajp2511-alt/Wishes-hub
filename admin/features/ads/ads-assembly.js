/**
 * Wishes Hub - Master Ads Assembly Controller
 * File: admin/features/ads/ads-assembly.js
 * Description: Binds all individual ad modules into a single production pipeline
 *              without relying on index.js barrel files.
 */

import { AdsCore } from './ads-core.js';
import { AdsRequestForm } from './modules/ads-request-form.js';
import { AdsAiGenerator } from './modules/ads-ai-generator.js';
import { AdsFreeTemplates } from './modules/ads-free-templates.js';
import { AdsApprovalGuard } from './modules/ads-approval-guard.js';
import { AdsList } from './modules/ads-list.js';
import { AdsAdvertiser } from './modules/ads-advertiser.js';
import { AdsBilling } from './modules/ads-billing.js';
import { AdsGeoTarget } from './modules/ads-geo-target.js';
import { AdsScheduler } from './modules/ads-scheduler.js';
import { AdsRotator } from './modules/ads-rotator.js';
import { AdsFraudGuard } from './modules/ads-fraud-guard.js';
import { AdsPreview } from './modules/ads-preview.js';
import { AdsQrCard } from './modules/ads-qr-card.js';
import { AdsSlotCalendar } from './modules/ads-slot-calendar.js';
import { AdsEventTrigger } from './modules/ads-event-trigger.js';
import { AdsFestivalDeals } from './modules/ads-festival-deals.js';
import { AdsReferral } from './modules/ads-referral.js';
import { AdsWhatsappDigest } from './modules/ads-whatsapp-digest.js';
import { AdsAnalytics } from './modules/ads-analytics.js';

export class AdsAssembly {
  constructor() {
    // 1. Initialize Master Core State
    this.core = new AdsCore();

    // 2. Instantiate Foundational Engine Modules
    this.approvalGuard = new AdsApprovalGuard(this.core);
    this.advertiser = new AdsAdvertiser(this.core);
    this.billing = new AdsBilling(this.core);
    this.geoTarget = new AdsGeoTarget();
    this.scheduler = new AdsScheduler(this.core);
    this.rotator = new AdsRotator();
    this.fraudGuard = new AdsFraudGuard();
    this.aiGenerator = new AdsAiGenerator(this.core);
    this.freeTemplates = new AdsFreeTemplates(this.core);
    this.preview = new AdsPreview();
    this.qrCard = new AdsQrCard();
    this.slotCalendar = new AdsSlotCalendar(this.core);
    this.eventTrigger = new AdsEventTrigger();
    this.festivalDeals = new AdsFestivalDeals();
    this.referral = new AdsReferral();
    this.whatsappDigest = new AdsWhatsappDigest();
    this.analytics = new AdsAnalytics();

    // 3. UI Component Engines
    this.requestFormUI = new AdsRequestForm(this.core);
    this.adsListUI = new AdsList(this.core, this.approvalGuard);

    this.initBackgroundJobs();
  }

  /**
   * Run background schedulers & auto-expiry checks
   */
  initBackgroundJobs() {
    this.scheduler.checkAndRunAutoExpiry();
  }

  /**
   * Universal Router Entry Point (Required by features-assembly.js)
   * @param {HTMLElement|string} target 
   * @param {string} subId 
   */
  async init(target = 'dynamic-content-root', subId = '') {
    const container = typeof target === 'string' ? document.getElementById(target) : target;
    if (!container) return;

    if (subId === 'ads-ai-generator' && this.aiGenerator && typeof this.aiGenerator.render === 'function') {
      this.aiGenerator.render(container);
    } else if (subId === 'ads-templates' && this.freeTemplates && typeof this.freeTemplates.render === 'function') {
      this.freeTemplates.render(container);
    } else {
      this.mountAdminDashboard(container);
    }
  }

  /**
   * Mount Public Request Form UI
   * @param {HTMLElement|string} target 
   */
  mountRequestForm(target) {
    this.requestFormUI.render(target);
  }

  /**
   * Mount Admin Ads Dashboard List UI
   * @param {HTMLElement|string} target 
   */
  mountAdminDashboard(target) {
    this.adsListUI.render(target);
  }
}

export async function init(target = 'dynamic-content-root', subId = '') {
  const instance = new AdsAssembly();
  return instance.init(target, subId);
}

export default AdsAssembly;
