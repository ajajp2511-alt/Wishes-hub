/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-currency.js
 * Description: Multi-currency conversion & localization engine.
 */

class PayCurrency {
    constructor() {
        // Base currency INR exchange rates
        this.exchangeRates = {
            'INR': 1.0,
            'USD': 0.012,
            'EUR': 0.011,
            'GBP': 0.0095,
            'USDT': 0.012
        };
    }

    /**
     * Convert amount between supported currencies with a safety buffer
     */
    convert(amount, fromCurrency = 'INR', toCurrency = 'USD', fxBufferPercent = 1.0) {
        const amt = parseFloat(amount);
        const from = fromCurrency.toUpperCase();
        const to = toCurrency.toUpperCase();

        if (!this.exchangeRates[from] || !this.exchangeRates[to]) {
            throw new Error(`Unsupported currency conversion: ${from} to ${to}`);
        }

        // Convert to base INR first, then to target
        const amountInINR = amt / this.exchangeRates[from];
        let convertedAmount = amountInINR * this.exchangeRates[to];

        // Apply FX Volatility Buffer
        const bufferAmount = (convertedAmount * fxBufferPercent) / 100;
        const finalAmount = parseFloat((convertedAmount + bufferAmount).toFixed(2));

        return {
            originalAmount: amt,
            fromCurrency: from,
            toCurrency: to,
            convertedAmount: finalAmount,
            fxBufferApplied: parseFloat(bufferAmount.toFixed(4)),
            rateUsed: this.exchangeRates[to] / this.exchangeRates[from]
        };
    }
}

module.exports = new PayCurrency();
