export const WALLET_CONFIG = {
    BASE_CURRENCY: 'INR',
    SUPPORTED_CURRENCIES: ['INR', 'USD', 'EUR', 'USDT'],
    PLATFORM_COMMISSION_PERCENT: 5, // 5% fee split on withdrawals and money gifts
    ESCROW_HOLDING_DAYS: 3,
    REFUND_EXPIRY_DAYS: 7,
    GOOGLE_SHEETS_ENDPOINT: 'https://sheets.googleapis.com/v4/spreadsheets/wishes-hub-wallet-ledger',
    LOYALTY_TIERS: {
        BRONZE: { minSpend: 0, cashback: 1 },
        SILVER: { minSpend: 5000, cashback: 2.5 },
        GOLD: { minSpend: 20000, cashback: 5 },
        PLATINUM: { minSpend: 50000, cashback: 10 }
    }
};
