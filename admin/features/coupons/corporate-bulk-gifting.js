/**
 * B2B Corporate Bulk Gifting Scheduler & CSV Recipient Dispatch
 * Path: admin/features/coupons/corporate-bulk-gifting.js
 * Description: Enables HRs and corporate clients to upload employee/client CSVs
 *              and dispatch bulk digital gift cards with festival greetings.
 */

import { couponsCore } from './coupons-core.js';

export class CorporateBulkGiftingEngine {
  constructor() {
    this.core = couponsCore;
  }

  /**
   * Parse Bulk Recipient List CSV Text
   * Expected Columns: recipientName, recipientMobile, recipientEmail, giftCardBrand, denominationINR
   */
  parseRecipientCSV(csvText) {
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const recipients = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === headers.length) {
        recipients.push({
          recipientName: values[0],
          recipientMobile: values[1],
          recipientEmail: values[2],
          giftCardBrand: values[3],
          denominationINR: Number(values[4]) || 500
        });
      }
    }

    return recipients;
  }

  /**
   * Schedule Corporate Bulk Gifting Order
   */
  scheduleCorporateBulkOrder({ corporateName, hrEmail, recipientCsvText, scheduledDate, customGreetingMessage }) {
    this.core.log('CORPORATE_GIFTING', `Processing bulk corporate order request from [${corporateName}]`, 'INFO');

    const recipients = this.parseRecipientCSV(recipientCsvText);
    if (recipients.length === 0) {
      return { success: false, error: 'Recipient CSV is empty or malformed.' };
    }

    const totalOrderCostINR = recipients.reduce((acc, curr) => acc + curr.denominationINR, 0);

    const bulkOrder = {
      orderId: 'B2B_GIFT_' + Date.now(),
      corporateName,
      hrEmail,
      recipientCount: recipients.length,
      totalOrderCostINR,
      scheduledDate: scheduledDate || new Date().toISOString(),
      customGreetingMessage: customGreetingMessage || 'Wishing you a joyful celebration from our leadership team!',
      recipients,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString()
    };

    this.core.log('CORPORATE_GIFTING', `Scheduled bulk order [${bulkOrder.orderId}] for ${recipients.length} recipients. Total Value: ₹${totalOrderCostINR}`, 'SUCCESS');

    return {
      success: true,
      orderId: bulkOrder.orderId,
      recipientCount: bulkOrder.recipientCount,
      totalOrderCostINR,
      status: bulkOrder.status
    };
  }
}

export const corporateBulkGifting = new CorporateBulkGiftingEngine();
