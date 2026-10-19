/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-adapter-crypto.js
 * Description: Crypto gateway adapter & volatility hedge engine (USDT, BTC, USDC).
 */

class PayAdapterCrypto {
    /**
     * Generate crypto invoice address with rate locking
     */
    async generateCryptoInvoice(params) {
        const { transactionId, amountFiat, cryptoSymbol = 'USDT' } = params;

        // Mock conversion rate
        const usdtRateINR = 88.5;
        const amountCrypto = parseFloat((amountFiat / usdtRateINR).toFixed(4));

        return {
            transactionId,
            cryptoSymbol,
            amountCrypto,
            paymentAddress: `0x71C${Math.random().toString(36).substring(2, 15)}...`,
            expiresInSeconds: 900, // 15-min rate lock
            status: 'WAITING_FOR_DEPOSIT'
        };
    }
}

module.exports = new PayAdapterCrypto();
