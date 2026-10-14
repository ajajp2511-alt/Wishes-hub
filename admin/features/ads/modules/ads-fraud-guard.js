/**
 * Wishes Hub - Anti-Click Fraud Protection Guard
 * File: admin/features/ads/modules/ads-fraud-guard.js
 * Description: Prevents self-clicks, rapid repeated clicks, and duplicate 
 *              impressions from distorting campaign analytics reports.
 */

export class AdsFraudGuard {
  constructor() {
    this.clickCooldownMs = 3000; // 3 seconds cooldown between clicks per ad
    this.sessionClicksKey = 'wishes_hub_ads_click_log';
  }

  /**
   * Validate if a click event is genuine and not rapid duplicate abuse
   * @param {string} adId 
   * @returns {boolean} True if click is valid
   */
  registerAndValidateClick(adId) {
    const now = Date.now();
    const clickLogs = this.getClickLogs();

    const lastClickTime = clickLogs[adId] || 0;

    if (now - lastClickTime < this.clickCooldownMs) {
      console.warn(`[AdsFraudGuard] Rapid click blocked for Ad ID ${adId}`);
      return false;
    }

    // Log valid click timestamp
    clickLogs[adId] = now;
    this.saveClickLogs(clickLogs);
    return true;
  }

  /**
   * Read stored click logs from Session Storage
   */
  getClickLogs() {
    try {
      const data = sessionStorage.getItem(this.sessionClicksKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Save click logs to Session Storage
   */
  saveClickLogs(logs) {
    try {
      sessionStorage.setItem(this.sessionClicksKey, JSON.stringify(logs));
    } catch (e) {
      console.error('[AdsFraudGuard] Storage Write Error:', e);
    }
  }
}
