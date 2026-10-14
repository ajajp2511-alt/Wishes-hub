/**
 * Sender & Receiver Personalization Engine
 * Path: admin/features/automation/modules/automation-personalizer.js
 * Description: Handles dynamic dual-name personalization (Sender & Receiver),
 *              URL query parameter generation, and 1-click viral WhatsApp share links.
 */

import { automationCore } from '../automation-core.js';

export class AutomationPersonalizerEngine {
  constructor() {
    this.core = automationCore;
  }

  /**
   * Format personalized wish text with Sender and Receiver names
   */
  formatPersonalizedMessage({ baseWish, senderName = '', receiverName = '', festivalName = 'Festival' }) {
    let personalizedHeadline = '';
    let formattedText = baseWish;

    const trimmedSender = senderName.trim();
    const trimmedReceiver = receiverName.trim();

    if (trimmedReceiver && trimmedSender) {
      personalizedHeadline = `Dear ${trimmedReceiver}, ${trimmedSender} has sent you a special ${festivalName} wish!`;
    } else if (trimmedReceiver) {
      personalizedHeadline = `Dear ${trimmedReceiver}, Happy ${festivalName}!`;
    } else if (trimmedSender) {
      personalizedHeadline = `Best wishes from ${trimmedSender} on ${festivalName}!`;
    } else {
      personalizedHeadline = `Happy ${festivalName}!`;
    }

    const result = {
      headline: personalizedHeadline,
      body: formattedText,
      sender: trimmedSender,
      receiver: trimmedReceiver,
      footerSignoff: trimmedSender ? `With Best Wishes From: ${trimmedSender}` : ''
    };

    this.core.log('PERSONALIZER', `Formatted personalized greeting [From: ${trimmedSender || 'N/A'}, To: ${trimmedReceiver || 'N/A'}]`, 'INFO');
    return result;
  }

  /**
   * Generate viral shareable URL with encoded names
   */
  generateShareableLink({ baseUrl = 'https://wishes-hub.com/greeting', festivalId, senderName = '', receiverName = '', is3D = false }) {
    const url = new URL(baseUrl);
    url.searchParams.set('fest', festivalId);

    if (senderName.trim()) {
      url.searchParams.set('from', encodeURIComponent(senderName.trim()));
    }
    if (receiverName.trim()) {
      url.searchParams.set('to', encodeURIComponent(receiverName.trim()));
    }
    if (is3D) {
      url.searchParams.set('mode', '3d');
    }

    return url.toString();
  }

  /**
   * Generate formatted WhatsApp share text payload
   */
  generateWhatsAppSharePayload({ shareLink, senderName = '', receiverName = '', festivalName = 'Festival' }) {
    let message = '';
    
    if (receiverName && senderName) {
      message = `✨ *${receiverName}*, *${senderName}* has sent you an interactive ${festivalName} wish card! 🎁\n\nClick here to open your personalized wish:\n${shareLink}`;
    } else if (senderName) {
      message = `✨ Special ${festivalName} wishes from *${senderName}*! 🎁\n\nClick the link to view your greeting card:\n${shareLink}`;
    } else {
      message = `✨ You have received a beautiful ${festivalName} greeting card! 🎁\n\nClick to open:\n${shareLink}`;
    }

    return encodeURIComponent(message);
  }
}

export const automationPersonalizer = new AutomationPersonalizerEngine();
