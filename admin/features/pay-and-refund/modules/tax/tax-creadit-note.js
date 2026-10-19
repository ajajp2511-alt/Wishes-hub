/**
 * Module: pay-and-refund
 * Sub-folder: tax/
 * File: tax-credit-note.js
 * Description: Proportional tax credit note generation for full or partial refunds.
 */

class TaxCreditNote {
    /**
     * Generate tax credit note data for refunded amounts
     */
    generateCreditNote(params) {
        const { originalInvoiceNumber, refundAmount, taxRate, taxName = 'Tax', currency = 'INR' } = params;

        const refAmount = parseFloat(refundAmount);
        const rate = parseFloat(taxRate);

        const refundedTax = parseFloat(((refAmount * rate) / (100 + rate)).toFixed(2));
        const refundedBase = parseFloat((refAmount - refundedTax).toFixed(2));

        const creditNoteNumber = `CN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        return {
            creditNoteNumber,
            originalInvoiceNumber,
            issueDate: new Date().toISOString(),
            currency,
            refundBreakdown: {
                totalRefunded: refAmount,
                baseRefunded: refundedBase,
                taxRefunded: refundedTax,
                taxName,
                taxRate: rate
            },
            status: 'ISSUED'
        };
    }
}

module.exports = new TaxCreditNote();
