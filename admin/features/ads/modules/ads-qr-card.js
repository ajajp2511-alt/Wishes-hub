/**
 * Wishes Hub - Printable QR Code & Digital Card Generator
 * File: admin/features/ads/modules/ads-qr-card.js
 * Description: Generates dedicated digital store cards and QR codes 
 *              to drive offline physical shop traffic to online wish pages.
 */

export class AdsQrCard {
  /**
   * Generate Digital Business Card Data & QR Image Link
   * @param {Object} advertiserData 
   * @returns {Object} Card Meta & QR URL
   */
  generateDigitalCard(advertiserData) {
    const cardUrl = `https://wishes-hub.com/store/${encodeURIComponent(advertiserData.businessName.toLowerCase().replace(/\s+/g, '-'))}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(cardUrl)}`;

    return {
      businessName: advertiserData.businessName,
      contactName: advertiserData.contactName,
      whatsapp: advertiserData.whatsapp,
      city: advertiserData.city,
      digitalCardUrl: cardUrl,
      qrCodeImageUrl: qrApiUrl
    };
  }
}
