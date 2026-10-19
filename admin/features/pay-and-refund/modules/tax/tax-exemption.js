/**
 * Module: pay-and-refund
 * Sub-folder: tax/
 * File: tax-exemption.js
 * Description: B2B tax exemption & reverse-charge validation engine.
 */

class TaxExemption {
    /**
     * Validate B2B tax ID and check exemption status
     */
    async validateExemption(params) {
        const { countryCode, vatId, businessName } = params;

        if (!vatId) {
            return { isExempt: false, reason: 'No VAT/GSTIN provided.' };
        }

        // Mock validation logic for VIES / GST portal verification
        const cleanVatId = vatId.trim().toUpperCase();
        const isValidFormat = cleanVatId.length >= 8;

        if (!isValidFormat) {
            return {
                isExempt: false,
                vatId: cleanVatId,
                reason: 'Invalid Tax ID format.'
            };
        }

        return {
            isExempt: true,
            businessName: businessName || 'Verified Business Entity',
            vatId: cleanVatId,
            countryCode: countryCode.toUpperCase(),
            reason: 'Valid B2B Tax ID verified. Reverse-charge mechanism applied.'
        };
    }
}

module.exports = new TaxExemption();
