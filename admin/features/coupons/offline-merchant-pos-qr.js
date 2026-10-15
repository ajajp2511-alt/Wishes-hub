/**
 * Offline Local Merchant QR Scanner & Instant Verification
 * Path: admin/features/coupons/offline-merchant-pos-qr.js
 * Description: Merchant POS engine for scanning customer digital QR passes
 *              and instantly marking local store vouchers as redeemed.
 */

import { couponsCore } from './coupons-core.js';

export class OfflineMerchantPOSQREngine {
  constructor() {
    this.core = couponsCore;
    this.redeemedVouchers = new Set();
  }

  /**
   * Verify and Redeem Digital QR Pass at Offline Merchant POS
   */
  verifyAndRedeemPass(scannedQrPayload, merchantId) {
    this.core.log('OFFLINE_POS', `Merchant [${merchantId}] scanning voucher payload...`, 'INFO');

    if (!scannedQrPayload || !scannedQrPayload.voucherId) {
      return { success: false, error: 'Invalid QR Code scanned.' };
    }

    const voucherId = scannedQrPayload.voucherId;

    // Check if voucher was already used
    if (this.redeemedVouchers.has(voucherId)) {
      this.core.log('OFFLINE_POS', `Voucher [${voucherId}] attempted double-use!`, 'WARN');
      return { success: false, error: 'ALREADY_REDEEMED', message: 'This coupon has already been redeemed.' };
    }

    // Mark as redeemed
    this.redeemedVouchers.add(voucherId);
    this.core.log('OFFLINE_POS', `Voucher [${voucherId}] successfully redeemed by Merchant [${merchantId}]`, 'SUCCESS');

    return {
      success: true,
      voucherId,
      status: 'REDEEMED_SUCCESSFULLY',
      redeemedAt: new Date().toISOString(),
      merchantId
    };
  }
}

export const offlineMerchantPOSQR = new OfflineMerchantPOSQREngine();
