/**
 * Campaigns & Marketing Core Engine
 * Path: admin/features/campaigns-marketing/marketing-core.js
 */

import { MARKETING_CONFIG } from './marketing-config.js';

export class MarketingCore {
  constructor() {
    this.campaigns = [...MARKETING_CONFIG.defaultCampaigns];
    this.botRules = [
      { id: 'rule_1', keyword: 'HAPPY BIRTHDAY', replyText: 'Here is your custom Birthday Wish link: {LINK}', active: true }
    ];
    this.links = [
      { id: 'link_1', originalUrl: 'https://hub.vercel.app/wish/101', shortCode: 'diwali26', clicks: 1420 }
    ];
  }

  getCampaigns() { return this.campaigns; }
  getBotRules() { return this.botRules; }
  getLinks() { return this.links; }

  addCampaign(campaign) {
    this.campaigns.push({
      id: `cmp_${Date.now()}`,
      status: 'Scheduled',
      ...campaign
    });
    return true;
  }

  generateShortLink(url, customSlug) {
    const newLink = {
      id: `link_${Date.now()}`,
      originalUrl: url,
      shortCode: customSlug || Math.random().toString(36).substring(7),
      clicks: 0
    };
    this.links.push(newLink);
    return newLink;
  }
}

export const marketingCoreInstance = new MarketingCore();
