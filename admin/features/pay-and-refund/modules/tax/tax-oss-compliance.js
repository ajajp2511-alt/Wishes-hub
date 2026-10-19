/**
 * Module: pay-and-refund
 * Sub-folder: tax/
 * File: tax-oss-compliance.js
 * Description: Cross-border EU OSS, US Sales Tax thresholds, and UK digital compliance.
 */

class TaxOSSCompliance {
    constructor() {
        // EU OSS threshold for digital services (€10,000 cross-border)
        this.euOssThresholdEUR = 10000;
        this.merchantCrossBorderSalesEUR = 0;
    }

    /**
     * Evaluate if cross-border transaction falls under OSS or local destination VAT rules
     */
    evaluateCompliance(params) {
        const { buyerCountry, sellerCountry = 'DE', saleAmountEUR = 0 } = params;

        const isEU = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PL'].includes(buyerCountry.toUpperCase());
        
        if (isEU && buyerCountry.toUpperCase() !== sellerCountry.toUpperCase()) {
            this.merchantCrossBorderSalesEUR += parseFloat(saleAmountEUR);
            const useOSS = this.merchantCrossBorderSalesEUR >= this.euOssThresholdEUR;

            return {
                jurisdiction: 'EU_CROSS_BORDER',
                destinationCountry: buyerCountry.toUpperCase(),
                applyDestinationVat: true,
                complianceMode: useOSS ? 'EU_OSS_SCHEME' : 'STANDARD_REGISTRATION',
                accumulatedCrossBorderSalesEUR: this.merchantCrossBorderSalesEUR
            };
        }

        return {
            jurisdiction: 'DOMESTIC_OR_NON_EU',
            destinationCountry: buyerCountry.toUpperCase(),
            applyDestinationVat: true,
            complianceMode: 'LOCAL_TAX_RULES'
        };
    }
}

module.exports = new TaxOSSCompliance();
