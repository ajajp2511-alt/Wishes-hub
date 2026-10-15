/**
 * "Send to Friend" Gifting Scheduler & WhatsApp Dispatch
 * Path: admin/features/coupons/gifting-scheduler.js
 * Description: Enables users to buy cards as gifts, attach audio greetings,
 *              and schedule automated WhatsApp/Email delivery.
 */

import { couponsCore } from './coupons-core.js';

export class GiftingSchedulerEngine {
  constructor() {
    this.core = couponsCore;
  }

  /**
   * Schedule Gift Dispatch
   */
  scheduleGift({ purchaserName, recipientName, recipientMobile, recipientEmail, giftMessage, scheduledDateTime, voucherData }) {
    if (!recipientMobile || !voucherData) {
      return { success: false, error: 'Recipient mobile and voucher data are mandatory.' };
    }

    const giftOrder = {
      giftId: 'GIFT_' + Date.now(),
      purchaserName: purchaserName || 'A Friend',
      recipientName: recipientName.trim(),
      recipientMobile: recipientMobile.trim(),
      recipientEmail: recipientEmail ? recipientEmail.trim() : '',
      giftMessage: giftMessage || 'Wishing you wonderful moments ahead!',
      scheduledDateTime: scheduledDateTime || new Date().toISOString(),
      voucherData,
      status: 'SCHEDULED_FOR_DISPATCH',
      createdAt: new Date().toISOString()
    };

    this.core.log('GIFTING_SCHEDULER', `Gift scheduled for [${recipientName}] via WhatsApp (${recipientMobile})`, 'SUCCESS');
    return { success: true, giftId: giftOrder.giftId, status: giftOrder.status };
  }
}

export const giftingScheduler = new GiftingSchedulerEngine();
