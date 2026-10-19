/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-ppp.js
 * Description: Purchasing Power Parity (PPP) dynamic pricing engine.
 */

class PayPPP {
    constructor() {
        // PPP Discount Multipliers relative to base USD/INR pricing
        this.pppFactors = {
            'IN': 1.0,   // Standard base
            'US': 1.0,   // Full price
            'BR': 0.60,  // 40% discount
            'ID': 0.55,  // 45% discount
            'NG': 0.50,  // 50% discount
            'PK': 0.45,  // 55% discount
            'PH': 0.65   // 35% discount
        };
    }

    /**
     * Get PPP adjusted price for target country
     */
    calculatePPPPrice(basePrice, countryCode = 'IN') {
        const price = parseFloat(basePrice);
        const code = countryCode.toUpperCase();
        const factor = this.pppFactors[code] || 1.0;

        const adjustedPrice = parseFloat((price * factor).toFixed(2));
        const discountAppliedPercent = parseFloat(((1 - factor) * 100).toFixed(2));

        return {
            originalPrice: price,
            countryCode: code,
            pppFactor: factor,
            adjustedPrice,
            discountAppliedPercent,
            isPPPApplied: factor < 1.0
        };
    }
}

module.exports = new PayPPP();
