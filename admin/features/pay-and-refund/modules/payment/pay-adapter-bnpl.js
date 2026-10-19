/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-adapter-bnpl.js
 * Description: BNPL & Card EMI gateway adapter.
 */

class PayAdapterBNPL {
    /**
     * Initiate BNPL / EMI checkout
     */
    async initiateBNPLCheckout(params) {
        const { transactionId, amount, provider = 'Klarna', tenureMonths = 3 } = params;

        const monthlyEMI = parseFloat((amount / tenureMonths).toFixed(2));

        return {
            transactionId,
            provider,
            tenureMonths,
            monthlyEMI,
            redirectUrl: `https://checkout.${provider.toLowerCase()}.com/pay/${transactionId}`,
            status: 'INITIATED'
        };
    }
}

module.exports = new PayAdapterBNPL();
