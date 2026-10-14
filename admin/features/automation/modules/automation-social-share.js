/**
 * WhatsApp & Social Share Broadcast Builder
 * Path: admin/features/automation/modules/automation-social-share.js
 * Description: Constructs multi-platform viral share links and formatted broadcast payloads
 *              for WhatsApp, Telegram, Facebook, Twitter, and LinkedIn.
 */

import { automationCore } from '../automation-core.js';

export class AutomationSocialShareEngine {
  constructor() {
    this.core = automationCore;
  }

  /**
   * Generate multi-channel share URLs for a festival campaign
   */
  generateShareChannels({ shareLink, festivalName, senderName = '', customMessage = '' }) {
    const defaultText = customMessage || (senderName 
      ? `✨ *${senderName}* sent you a special 3D *${festivalName}* wish card! 🎁\n\nClick to open your personalized greeting:\n${shareLink}`
      : `✨ Check out this beautiful 3D *${festivalName}* greeting card! 🎁\n\nClick to view:\n${shareLink}`);

    const encodedText = encodeURIComponent(defaultText);
    const encodedUrl = encodeURIComponent(shareLink);

    const channels = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };

    this.core.log('SOCIAL_SHARE', `Generated share channels payload for ${festivalName}`, 'INFO');
    return {
      festivalName,
      shareLink,
      channels,
      rawMessage: defaultText
    };
  }
}

export const automationSocialShare = new AutomationSocialShareEngine();
