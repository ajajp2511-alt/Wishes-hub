/**
 * Module: pay-and-refund
 * Sub-folder: tax/
 * File: tax-ledger.js
 * Description: Automated tax settlement and country-wise liability tracker.
 */

class TaxLedger {
    constructor() {
        this.liabilityLedger = new Map();
    }

    /**
     * Record collected tax toward country liability
     */
    recordTaxLiability(transactionId, taxDetails, currency = 'INR') {
        const { countryCode = 'IN', taxAmount = 0, taxName = 'Tax' } = taxDetails;
        const amount = parseFloat(taxAmount);

        if (amount <= 0) return;

        if (!this.liabilityLedger.has(countryCode)) {
            this.liabilityLedger.set(countryCode, {
                countryCode,
                taxName,
                totalCollected: 0,
                currency,
                recordsCount: 0,
                lastUpdated: new Date().toISOString()
            });
        }

        const entry = this.liabilityLedger.get(countryCode);
        entry.totalCollected = parseFloat((entry.totalCollected + amount).toFixed(2));
        entry.recordsCount += 1;
        entry.lastUpdated = new Date().toISOString();

        return {
            status: 'RECORDED',
            transactionId,
            countryCode,
            liabilityLedgerSummary: entry
        };
    }

    /**
     * Fetch accumulated liabilities for tax reporting / filing
     */
    getLiabilities() {
        const report = {};
        for (let [country, data] of this.liabilityLedger.entries()) {
            report[country] = data;
        }
        return report;
    }
}

module.exports = new TaxLedger();
