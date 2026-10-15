/**
 * Viral Referral Link Builder & Social Broadcast Formatter
 * Path: admin/features/coupons/coupons-social-share.js
 * Description: Generates custom social sharing links and pre-formatted text
 *              payloads for WhatsApp, Telegram, and Facebook sharing.
 */

import { couponsCore } from './coupons-core.js';

export class CouponsSocialShareEngine {
  constructor() {
    this.core = couponsCore;
  }

  /**
   * Build Social Share Payloads
   */
  buildSharePayload(couponItem, referrerUserId = 'USER_REF_101') {
    const shareUrl = `https://wishes-hub.com/coupons/deal/${couponItem.id}?ref=${referrerUserId}`;
    
    const whatsappText = `🏷️ *Hot Coupon Deal on Wishes Hub!*\n\n` +
      `Get *${couponItem.title}* (Value: ₹${couponItem.faceValueINR}) for only *₹${couponItem.sellingPriceINR}*!\n\n` +
      `👇 Claim deal here:\n${shareUrl}`;

    return {
      shareUrl,
      whatsappShareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`,
      telegramShareUrl: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(couponItem.title)}`,
      formattedText: whatsappText
    };
  }
}

export const couponsSocialShare = new CouponsSocialShareEngine();
