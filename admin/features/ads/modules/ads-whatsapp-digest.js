/**
 * Wishes Hub - WhatsApp Performance Summary Dispatcher
 * File: admin/features/ads/modules/ads-whatsapp-digest.js
 * Description: Formats weekly performance digests for single-click WhatsApp delivery to clients.
 */

export class AdsWhatsappDigest {
  /**
   * Format Performance Report Message for WhatsApp
   * @param {Object} adRecord 
   * @param {Object} metrics ({ views, clicks })
   * @returns {string} Encoded WhatsApp URL
   */
  formatDigestMessage(adRecord, metrics = { views: 1250, clicks: 85 }) {
    const text = `Namaste ${adRecord.businessName}! 🌟\n\n` +
      `Here is your Wishes Hub Ad Performance Update:\n` +
      `👀 Total Local Views: ${metrics.views}\n` +
      `👆 Total Direct Enquiries: ${metrics.clicks}\n\n` +
      `Thank you for growing with Wishes Hub!`;

    const cleanWa = adRecord.whatsapp.replace(/\D/g, '');
    return `https://wa.me/91${cleanWa}?text=${encodeURIComponent(text)}`;
  }
}
