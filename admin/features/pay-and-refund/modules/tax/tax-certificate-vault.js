/**
 * Module: pay-and-refund
 * Sub-folder: tax/
 * File: tax-certificate-vault.js
 * Description: B2B and Non-profit exemption document verification and vault.
 */

class TaxCertificateVault {
    constructor() {
        this.certificates = new Map();
    }

    /**
     * Store and verify uploaded exemption certificate
     */
    registerCertificate(params) {
        const { userId, documentId, issuingCountry, expiryDate } = params;

        const isExpired = new Date(expiryDate) < new Date();
        if (isExpired) {
            throw new Error('Provided tax exemption certificate is expired.');
        }

        const certRecord = {
            userId,
            documentId,
            issuingCountry: issuingCountry.toUpperCase(),
            expiryDate,
            status: 'VERIFIED',
            registeredAt: new Date().toISOString()
        };

        this.certificates.set(userId, certRecord);
        return certRecord;
    }

    hasValidCertificate(userId) {
        const cert = this.certificates.get(userId);
        if (!cert) return false;
        const isExpired = new Date(cert.expiryDate) < new Date();
        return !isExpired && cert.status === 'VERIFIED';
    }
}

module.exports = new TaxCertificateVault();
