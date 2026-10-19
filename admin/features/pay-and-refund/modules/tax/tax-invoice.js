/**
 * Module: pay-and-refund
 * Sub-folder: tax/
 * File: tax-invoice.js
 * Description: Localized PDF invoice meta-data generator and itemized billing formatter.
 */

class TaxInvoice {
    /**
     * Generate structured invoice data with tax breakdown
     */
    generateInvoiceData(transactionData, taxDetails) {
        const { transactionId, userId, items = [], currency = 'INR', surchargeAmount = 0 } = transactionData;

        const baseTotal = taxDetails.baseAmount;
        const taxTotal = taxDetails.taxAmount;
        const surchargeTotal = parseFloat(surchargeAmount || 0);
        const grandTotal = parseFloat((baseTotal + taxTotal + surchargeTotal).toFixed(2));

        const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        return {
            invoiceNumber,
            transactionId,
            userId,
            issueDate: new Date().toISOString(),
            currency,
            lineItems: items.length > 0 ? items : [{ description: 'Digital Content / Wishes Service', amount: baseTotal }],
            breakdown: {
                subtotal: baseTotal,
                taxRate: taxDetails.taxRate,
                taxName: taxDetails.taxName,
                taxAmount: taxTotal,
                surchargeAmount: surchargeTotal,
                grandTotal
            },
            taxExempt: taxDetails.isExempt || false,
            complianceNote: taxDetails.isExempt 
                ? 'Tax Exempt under B2B reverse charge regulations.' 
                : `Includes localized ${taxDetails.taxName || 'tax'} calculation.`
        };
    }
}

module.exports = new TaxInvoice();
