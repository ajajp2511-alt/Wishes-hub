/**
 * Module: pay-and-refund
 * File: pay-refund-config.js
 * Description: Core configuration and environment variables for WishesPay Global Engine.
 */

module.exports = {
    environment: process.env.NODE_ENV || 'production',
    defaultCurrency: 'INR',
    supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'USDT'],
    
    // Refund Policies
    refund: {
        windowHours: 24, // Strict 1 day limit
        walletBonusPercent: 5.0, // Extra incentive for wallet credit
        allowAutoApprovalForErrors: true
    },

    // Tax & Surcharge Settings
    tax: {
        provider: process.env.TAX_PROVIDER || 'stripe_tax', // or custom global tax API
        defaultRate: 18.0, // e.g., Standard GST in India (%)
        enableGlobalGeoLookup: true
    },

    surcharge: {
        passToCustomer: true,
        fiatGatewayFeePercent: 2.5,
        cryptoGatewayFeePercent: 1.0
    },

    // Gateway API Keys & Endpoints (Loaded from Environment)
    gateways: {
        fiat: {
            provider: 'stripe_razorpay_hybrid',
            apiKey: process.env.FIAT_GATEWAY_API_KEY || '',
            webhookSecret: process.env.FIAT_WEBHOOK_SECRET || ''
        },
        crypto: {
            provider: 'coinbase_nowpayments',
            apiKey: process.env.CRYPTO_GATEWAY_API_KEY || '',
            webhookSecret: process.env.CRYPTO_WEBHOOK_SECRET || ''
        }
    },

    security: {
        maxFailedAttempts: 3,
        velocityWindowMinutes: 5,
        hmacAlgorithm: 'sha256'
    }
};
