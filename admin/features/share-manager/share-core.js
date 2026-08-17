/**
 * Share Core Engine
 * Path: admin/features/share-manager/share-core.js
 */

import { SHARE_CONFIG } from './share-config.js';

export class ShareCore {
  constructor() {
    this.templates = [
      { id: 'TPL-WA-01', name: 'Diwali Festive Greeting', target: 'WhatsApp', text: '✨ *Happy Diwali!* {sender} sent you a warm wish: {link}', shares: 28400 },
      { id: 'TPL-TG-01', name: 'New Year Special', target: 'Telegram', text: '🎆 Wishing you a bright 2026! Check card from {sender}: {link}', shares: 12100 }
    ];

    this.viralityStats = {
      kFactor: '1.42',
      totalViralShares: '184,200',
      topPlatform: 'WhatsApp Groups',
      conversionRate: '24.8%'
    };
  }

  getTemplates() { return this.templates; }
  getViralityStats() { return this.viralityStats; }

  generateShareUrl(platform, params) {
    const baseUrl = SHARE_CONFIG.defaultAppUrl;
    const encodedText = encodeURIComponent(params.text || '');
    if (platform === 'whatsapp') {
      return `https://api.whatsapp.com/send?text=${encodedText}`;
    } else if (platform === 'telegram') {
      return `https://t.me/share/url?url=${encodeURIComponent(baseUrl)}&text=${encodedText}`;
    }
    return baseUrl;
  }
}

export const shareCoreInstance = new ShareCore();
