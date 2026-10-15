/**
 * Global & Custom Coupon Marketplace Configuration
 * Path: admin/features/coupons/coupons-config.js
 * Description: Master settings, API aggregator endpoints, supported currencies,
 *              commission thresholds, and anti-fraud limits.
 */

export const COUPONS_CONFIG = {
  moduleName: 'Global & Custom Coupon Card Marketplace',
  version: '2.0.0-PROD',
  activeEnvironment: 'production',

  // Currency Support & Conversion Defaults
  currencies: {
    defaultCurrency: 'INR',
    supported: [
      { code: 'INR', symbol: '₹', exchangeRateFromINR: 1.0 },
      { code: 'USD', symbol: '$', exchangeRateFromINR: 0.012 },
      { code: 'EUR', symbol: '€', exchangeRateFromINR: 0.011 },
      { code: 'AED', symbol: 'د.إ', exchangeRateFromINR: 0.044 }
    ]
  },

  // API Reseller Aggregators Configuration
  apiAggregators: {
    qwikcilver: {
      enabled: true,
      baseUrl: 'https://api.qwikcilver.com/v2/giftcards',
      timeoutMs: 8000
    },
    giftbit: {
      enabled: true,
      baseUrl: 'https://api.giftbit.com/papi/v1/brands',
      timeoutMs: 8000
    },
    customPartnerApi: {
      enabled: true,
      baseUrl: 'https://wishes-hub.com/api/v1/partner-inventory',
      timeoutMs: 5000
    }
  },

  // Default Commission & Margin Thresholds
  financials: {
    defaultPlatformCommissionPercent: 8.0, // 8% profit margin on custom/partner cards
    minimumPayoutThresholdINR: 1000,
    cashbackPercentage: 2.5, // 2.5% wallet cashback on every purchase
    referralBonusPoints: 100
  },

  // Anti-Fraud Guard Settings
  fraudGuard: {
    maxPurchasesPerIPPerHour: 5,
    highRiskOrderValueThresholdINR: 10000,
    requireOTPForHighRisk: true,
    maxFailedRedeemAttempts: 3
  },

  // Delivery Channels
  delivery: {
    instantWhatsAppDispatch: true,
    instantEmailDispatch: true,
    smsFallbackEnabled: false
  }
};
