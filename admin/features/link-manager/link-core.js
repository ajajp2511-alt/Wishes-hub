/**
 * Link Core Engine
 * Path: admin/features/link-manager/link-core.js
 */

import { LINK_CONFIG } from './link-config.js';

export class LinkCore {
  constructor() {
    this.shortLinks = [
      { id: 'LNK-101', slug: 'diwali2026', originalUrl: 'https://hub.vercel.app/wishes/diwali', clicks: 14250, domain: LINK_CONFIG.defaultDomain, status: 'Active' },
      { id: 'LNK-102', slug: 'festive-gift', originalUrl: 'https://hub.vercel.app/gifts/card', clicks: 8320, domain: LINK_CONFIG.defaultDomain, status: 'Active' }
    ];

    this.redirectRules = [
      { id: 'RED-01', source: '/old-wishes', destination: '/wishes', type: '301 Permanent', status: 'Enabled' },
      { id: 'RED-02', source: '/promo', destination: '/offers/festive', type: '302 Temporary', status: 'Enabled' }
    ];
  }

  getShortLinks() { return this.shortLinks; }
  getRedirectRules() { return this.redirectRules; }

  generateShortLink(originalUrl, customSlug) {
    const slug = customSlug || Math.random().toString(36).substring(2, 8);
    const newLink = {
      id: `LNK-${Date.now()}`,
      slug,
      originalUrl,
      clicks: 0,
      domain: LINK_CONFIG.defaultDomain,
      status: 'Active'
    };
    this.shortLinks.push(newLink);
    return newLink;
  }
}

export const linkCoreInstance = new LinkCore();
