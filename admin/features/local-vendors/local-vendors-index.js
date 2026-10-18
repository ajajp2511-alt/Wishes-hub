/**
 * Wishes Hub - Local Vendor Engine Main Assembly Entry Point
 * File: local-vendors-index.js
 */

import { VENDOR_CONFIG } from './local-vendors-config.js';
import { coreEngine } from './local-vendors-core.js';

// Module Imports
import { vendorOnboarding } from './modules/vendor-onboarding-form.js';
import { dynamicRadiusControl } from './modules/dynamic-radius-control.js';
import { pinServiceability } from './modules/pin-serviceability.js';
import { whatsappCommandProcessor } from './modules/whatsapp-command-processor.js';
import { vacationModeScheduler } from './modules/vacation-mode-scheduler.js';
import { smartRoutingFallback } from './modules/smart-routing-fallback.js';
import { metadataEngine } from './modules/metadata-engine.js';
import { embeddedDeliveryPricing } from './modules/embedded-delivery-pricing.js';
import { multiTierPayout } from './modules/multi-tier-payout.js';
import { deliveryProofCapture } from './modules/delivery-proof-capture.js';
import { midnightEventScheduler } from './modules/midnight-event-scheduler.js';
import { riderPreassignment } from './modules/rider-preassignment.js';
import { anonymousGiftingCodes } from './modules/anonymous-gifting-codes.js';
import { emotionGuardFilter } from './modules/emotion-guard-filter.js';
import { vendorPerformanceRatings } from './modules/vendor-performance-ratings.js';
import { vendorNotifications } from './modules/vendor-notifications.js';
import { vendorSettlementReports } from './modules/vendor-settlement-reports.js';
import { vendorHealthMonitor } from './modules/vendor-health-monitor.js';
import { vendorAuditLogger } from './modules/vendor-audit-logger.js';

class LocalVendorEngine {
  constructor() {
    this.config = VENDOR_CONFIG;
    this.core = coreEngine;
    
    // Attach 19 Sub-Modules
    this.onboarding = vendorOnboarding; // Module 1
    this.radius = dynamicRadiusControl; // Module 2
    this.serviceability = pinServiceability; // Module 3
    this.whatsapp = whatsappCommandProcessor; // Module 4
    this.vacation = vacationModeScheduler; // Module 5
    this.routing = smartRoutingFallback; // Module 6
    this.metadata = metadataEngine; // Module 7
    this.pricing = embeddedDeliveryPricing; // Module 8
    this.payout = multiTierPayout; // Module 9
    this.proof = deliveryProofCapture; // Module 10
    this.scheduler = midnightEventScheduler; // Module 11
    this.rider = riderPreassignment; // Module 12
    this.anonymous = anonymousGiftingCodes; // Module 13
    this.emotionGuard = emotionGuardFilter; // Module 14
    this.ratings = vendorPerformanceRatings; // Module 15
    this.notifications = vendorNotifications; // Module 16
    this.settlements = vendorSettlementReports; // Module 17
    this.health = vendorHealthMonitor; // Module 18
    this.audit = vendorAuditLogger; // Module 19
  }

  /**
   * System Health Checklist & Initialization Check
   */
  init() {
    return {
      status: 'ENGINE_READY',
      totalModulesLoaded: 19,
      timestamp: new Date().toISOString()
    };
  }
}

export const localVendorEngine = new LocalVendorEngine();
export default localVendorEngine;
