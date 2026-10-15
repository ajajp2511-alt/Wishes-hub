/**
 * Dynamic Multi-Currency Switcher & Locale Formatter
 * Path: admin/features/coupons/coupons-currency-converter.js
 * Description: Handles real-time conversion rates between INR, USD, EUR, AED 
 *              and formats localized currency strings with correct symbols.
 */

import { COUPONS_CONFIG } from './coupons-config.js';
import { couponsCore } from './coupons-core.js';

export class CouponsCurrencyConverter {
  constructor() {
    this.config = COUPONS_CONFIG;
    this.core = couponsCore;
    this.activeCurrency = this.config.currencies.defaultCurrency;
  }

  /**
   * Set Active Currency Code
   */
  setActiveCurrency(currencyCode) {
    const matched = this.config.currencies.supported.find(c => c.code === currencyCode.toUpperCase());
    if (matched) {
      this.activeCurrency = matched.code;
      this.core.log('CURRENCY', `Active currency switched to: ${this.activeCurrency}`, 'INFO');
      return true;
    }
    this.core.log('CURRENCY', `Unsupported currency code requested: ${currencyCode}`, 'WARN');
    return false;
  }

  /**
   * Convert Value from INR Base to Target Currency
   */
  convertFromINR(amountINR, targetCurrencyCode = this.activeCurrency) {
    const currencyObj = this.config.currencies.supported.find(c => c.code === targetCurrencyCode.toUpperCase()) ||
                        this.config.currencies.supported[0];
    
    const convertedValue = amountINR * currencyObj.exchangeRateFromINR;
    return {
      originalINR: amountINR,
      convertedValue: parseFloat(convertedValue.toFixed(2)),
      currencyCode: currencyObj.code,
      symbol: currencyObj.symbol
    };
  }

  /**
   * Format Currency Output String (e.g. ₹500, $6.00, €5.50)
   */
  format(amountINR, overrideCurrency = null) {
    const targetCode = overrideCurrency || this.activeCurrency;
    const conversion = this.convertFromINR(amountINR, targetCode);

    if (conversion.currencyCode === 'INR') {
      return `₹${conversion.convertedValue.toLocaleString('en-IN')}`;
    }
    return `${conversion.symbol}${conversion.convertedValue.toFixed(2)}`;
  }
}

export const couponsCurrencyConverter = new CouponsCurrencyConverter();
