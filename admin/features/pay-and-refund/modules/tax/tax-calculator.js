/**
 * Module: pay-and-refund
 * Sub-folder: tax/
 * File: tax-calculator.js
 * Description: Multi-country real-time API tax calculation (VAT/GST/Sales Tax) engine.
 */

const config = require('../../pay-refund-config');

class TaxCalculator {
    constructor() {
        this.defaultRate = config.tax?.defaultRate || 18.0;
        // Static country tax mapping for offline fallback / standard rates
        this.countryTaxRates = {
            'IN': { rate: 18.0, name: 'GST', type: 'INCLUSIVE_OR_EXCLUSIVE' },
            'US': { rate: 8.5, name: 'Sales Tax', type: 'EXCLUSIVE' },
            'GB': { rate: 20.0, name: 'VAT', type: 'EXCLUSIVE' },
            'DE': { rate: 19.0, name: 'VAT', type: 'EXCLUSIVE' },
            'FR': { rate: 20.0, name: 'VAT', type: 'EXCLUSIVE' },
            'CA': { rate: 13.0, name: 'HST/GST', type: 'EXCLUSIVE' },
            'AU': { rate: 10.0, name: 'GST', type: 'EXCLUSIVE' },
            'AE': { rate: 5.0, name: 'VAT', type: 'EXCLUSIVE' }
        };
    }

    /**
     * Calculate tax for a given transaction amount and user country
     */
    async calculateTax(params) {
        const { baseAmount, countryCode = 'IN', isB2B = false, vatId = null } = params;
        const amount = parseFloat(baseAmount);

        if (isNaN(amount) || amount <= 0) {
            throw new Error('Invalid base amount provided for tax calculation.');
        }

        // B2B Reverse Charge Exemption Check
        if (isB2B && vatId) {
            return {
                baseAmount: amount,
                taxRate: 0,
                taxAmount: 0,
                totalAmountWithTax: amount,
                taxName: 'EXEMPT_B2B',
                isExempt: true,
                exemptionReason: 'Reverse Charge / B2B VAT Exemption'
            };
        }

        const taxInfo = this.countryTaxRates[countryCode.toUpperCase()] || {
            rate: this.defaultRate,
            name: 'Standard Tax',
            type: 'EXCLUSIVE'
        };

        const taxAmount = parseFloat(((amount * taxInfo.rate) / 100).toFixed(2));
        const totalAmountWithTax = parseFloat((amount + taxAmount).toFixed(2));

        return {
            baseAmount: amount,
            countryCode: countryCode.toUpperCase(),
            taxRate: taxInfo.rate,
            taxAmount,
            totalAmountWithTax,
            taxName: taxInfo.name,
            isExempt: false
        };
    }
}

module.exports = new TaxCalculator();
