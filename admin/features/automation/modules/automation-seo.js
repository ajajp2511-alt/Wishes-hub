/**
 * Dynamic SEO & Open Graph (OG) Card Builder Engine
 * Path: admin/features/automation/modules/automation-seo.js
 * Description: Dynamically constructs meta tags, canonical URLs, structured JSON-LD schemas,
 *              and social media share preview metadata for festival wish links.
 */

import { automationCore } from '../automation-core.js';

export class AutomationSEOEngine {
  constructor() {
    this.core = automationCore;
  }

  /**
   * Build Dynamic Meta & Social Card Metadata for Wish Page
   */
  generateSEOMetadata({ festivalName, senderName, receiverName, customQuote = '', pageUrl = 'https://wishes-hub.com' }) {
    const title = senderName 
      ? `${senderName} sent you a special ${festivalName} Wish! | Wishes Hub`
      : `Happy ${festivalName} - Send Free Personalized 3D Wishes | Wishes Hub`;

    const description = customQuote || `Create and share beautiful 3D interactive ${festivalName} greeting cards with your name and photo on WhatsApp!`;

    const ogImageUrl = `https://wishes-hub.com/api/og-builder?fest=${encodeURIComponent(festivalName)}&from=${encodeURIComponent(senderName || '')}`;

    const seoPayload = {
      title,
      metaTags: [
        { name: 'description', content: description },
        { name: 'keywords', content: `${festivalName} wishes, 3D greeting cards, personalized wishes, ${festivalName} WhatsApp status` },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: pageUrl },
        { property: 'og:image', content: ogImageUrl },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImageUrl }
      ],
      jsonLdSchema: {
        '@context': 'https://schema.org',
        '@type': 'SpecialAnnouncement',
        'name': `${festivalName} Greetings`,
        'text': description,
        'url': pageUrl
      }
    };

    this.core.log('SEO', `Generated dynamic meta tags and OG preview for ${festivalName}`, 'INFO');
    return seoPayload;
  }
}

export const automationSEO = new AutomationSEOEngine();
