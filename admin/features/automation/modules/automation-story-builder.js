/**
 * WhatsApp Status & Story Card Builder
 * Path: admin/features/automation/modules/automation-story-builder.js
 * Description: Auto-generates 9:16 vertical aspect ratio story and status card metadata
 *              optimized for WhatsApp Status, Instagram Stories, and Facebook Stories.
 */

import { automationCore } from '../automation-core.js';

export class AutomationStoryBuilderEngine {
  constructor() {
    this.core = automationCore;
  }

  /**
   * Build Vertical 9:16 Story Card Configuration
   */
  buildStoryCardPayload({ festivalName, senderName, themeColor = '#ff9900', sponsorData = null }) {
    const storyConfig = {
      aspectRatio: '9:16',
      dimensions: { width: 1080, height: 1920 },
      backgroundColor: themeColor,
      headerText: `✨ HAPPY ${festivalName.toUpperCase()} ✨`,
      senderText: senderName ? `From: ${senderName}` : 'Wishes Hub',
      sponsorBadge: sponsorData ? `Co-Powered by ${sponsorData.businessName}` : null,
      qrCodeUrl: sponsorData ? `https://wa.me/${sponsorData.whatsappNumber}` : null,
      ctaText: 'Tap link in bio / description to open your 3D wish!',
      exportFormat: 'png'
    };

    this.core.log('STORY_BUILDER', `Generated 9:16 story card layout for ${festivalName}`, 'INFO');
    return storyConfig;
  }
}

export const automationStoryBuilder = new AutomationStoryBuilderEngine();
