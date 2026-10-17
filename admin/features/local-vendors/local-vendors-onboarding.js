/**
 * @file local-vendors-onboarding.js
 * @description 5-Step B2B Vendor Onboarding Engine for Wishes Hub Local Vendor Module.
 * Handles shop registration, KYC, GPS location, operating capacity, and T&C compliance.
 * @module LocalVendorsOnboarding
 * @version 1.0.0
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./local-vendors-config', './local-vendors-core'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('./local-vendors-config'),
            require('./local-vendors-core')
        );
    } else {
        root.LocalVendorsOnboarding = factory(
            root.LocalVendorsConfig,
            root.LocalVendorsCore
        );
    }
}(typeof self !== 'undefined' ? self : this, function (LocalVendorsConfig, LocalVendorsCore) {
    'use strict';

    class VendorsOnboarding {
        constructor() {
            this.config = LocalVendorsConfig;
            this.core = LocalVendorsCore;
            this.currentStep = 1;
            this.formData = {
                // Step 1: Basic Profile
                shopName: '',
                ownerName: '',
                category: '', // Gifts, Bakery, Florist, Sweets, Toys
                phone: '',
                whatsappPhone: '',
                isPhoneVerified: false,
                storefrontImageUrl: '',

                // Step 2: Location & Radius Setup
                address: {
                    street: '',
                    landmark: '',
                    pincode: '',
                    city: '',
                    state: '',
                    country: 'IN'
                },
                locationCoordinates: {
                    lat: null,
                    lng: null
                },
                serviceRadiusKm: 5, // Default 5 km
                deliveryOptions: {
                    selfDelivery: false,
                    aggregatorDelivery: true,
                    storePickup: true
                },

                // Step 3: Business Verification & KYC
                kyc: {
                    gstin: '',
                    fssaiLicense: '', // Required for Bakery / Sweets / Cakes
                    panNumber: '',
                    panDocumentUrl: '',
                    msmeUdyamNumber: ''
                },

                // Step 4: Bank Details & Settlement
                bankDetails: {
                    accountHolderName: '',
                    accountNumber: '',
                    ifscCode: '',
                    bankName: '',
                    upiId: '',
                    payoutCycle: 'WEEKLY' // WEEKLY or BIWEEKLY
                },

                // Step 5: Operating Capacity & Legal Compliance
                operations: {
                    openingTime: '09:00',
                    closingTime: '22:00',
                    midnightDeliveryAvailable: false, // 12 AM Midnight slot toggle
                    operatingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    maxDailyCapacity: 20,
                    giftWrappingAvailable: true,
                    customCardPrintingAvailable: true,
                    deliveryFeeBearer: 'VENDOR_INCLUDED' // Delivery charge built into vendor listing
                },
                compliance: {
                    tncAccepted: false,
                    tncAcceptedAt: null,
                    policyVersion: '1.0.0'
                }
            };
        }

        /**
         * Initialize Onboarding Module
         */
        async init() {
            this.core.log('ONBOARDING', 'Vendor Onboarding Module Initialized.');
            return this;
        }

        /**
         * Get current form state
         */
        getFormData() {
            return this.formData;
        }

        /**
         * Update partial form data for specific step
         * @param {number} step - Step number (1 to 5)
         * @param {object} stepData - Data object
         */
        updateStepData(step, stepData) {
            switch (step) {
                case 1:
                    this.formData = { ...this.formData, ...stepData };
                    break;
                case 2:
                    this.formData.address = { ...this.formData.address, ...(stepData.address || {}) };
                    if (stepData.locationCoordinates) this.formData.locationCoordinates = stepData.locationCoordinates;
                    if (stepData.serviceRadiusKm) this.formData.serviceRadiusKm = stepData.serviceRadiusKm;
                    if (stepData.deliveryOptions) this.formData.deliveryOptions = { ...this.formData.deliveryOptions, ...stepData.deliveryOptions };
                    break;
                case 3:
                    this.formData.kyc = { ...this.formData.kyc, ...stepData };
                    break;
                case 4:
                    this.formData.bankDetails = { ...this.formData.bankDetails, ...stepData };
                    break;
                case 5:
                    if (stepData.operations) this.formData.operations = { ...this.formData.operations, ...stepData.operations };
                    if (stepData.compliance) this.formData.compliance = { ...this.formData.compliance, ...stepData.compliance };
                    break;
                default:
                    throw new Error(`[Onboarding] Invalid step number: ${step}`);
            }
            this.core.log('ONBOARDING', `Step ${step} data updated.`, this.formData);
        }

        /**
         * Validate current step before proceeding to next step
         * @param {number} step - Step number
         * @returns {object} { isValid: boolean, errors: array }
         */
        validateStep(step) {
            const errors = [];

            if (step === 1) {
                if (!this.formData.shopName.trim()) errors.push('Shop Name is required.');
                if (!this.formData.ownerName.trim()) errors.push('Owner Name is required.');
                if (!this.formData.category) errors.push('Business Category selection is required.');
                if (!this.formData.phone || this.formData.phone.length < 10) errors.push('Valid 10-digit Phone Number is required.');
            } else if (step === 2) {
                if (!this.formData.address.street.trim()) errors.push('Street Address is required.');
                if (!this.formData.address.pincode.trim()) errors.push('Pincode is required.');
                if (!this.formData.locationCoordinates.lat || !this.formData.locationCoordinates.lng) {
                    errors.push('GPS Location Coordinates are required.');
                }
            } else if (step === 3) {
                if (['Bakery', 'Sweets', 'Cakes'].includes(this.formData.category) && !this.formData.kyc.fssaiLicense.trim()) {
                    errors.push('FSSAI License Number is mandatory for food and cake vendors.');
                }
                if (!this.formData.kyc.panNumber.trim()) errors.push('PAN Card Number is required for verification.');
            } else if (step === 4) {
                if (!this.formData.bankDetails.accountNumber.trim()) errors.push('Bank Account Number is required.');
                if (!this.formData.bankDetails.ifscCode.trim()) errors.push('IFSC Code is required.');
                if (!this.formData.bankDetails.upiId.trim()) errors.push('Valid UPI ID is required for fast payouts.');
            } else if (step === 5) {
                if (!this.formData.compliance.tncAccepted) {
                    errors.push('You must read and agree to the Terms & Conditions and Vendor Agreement.');
                }
            }

            return {
                isValid: errors.length === 0,
                errors: errors
            };
        }

        /**
         * Submit completed onboarding form to backend/admin pipeline
         */
        async submitApplication() {
            // Validate all 5 steps
            for (let step = 1; step <= 5; step++) {
                const validation = this.validateStep(step);
                if (!validation.isValid) {
                    throw new Error(`Validation failed at Step ${step}: ${validation.errors.join(', ')}`);
                }
            }

            this.formData.compliance.tncAcceptedAt = new Date().toISOString();

            const payload = {
                vendorId: `VND-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                status: 'PENDING_VERIFICATION',
                createdAt: new Date().toISOString(),
                ...this.formData
            };

            this.core.log('ONBOARDING', 'Submitting vendor onboarding application...', payload);

            // Emit registration event for backend processing
            this.core.emit('vendor:onboarded', payload);

            return {
                success: true,
                vendorId: payload.vendorId,
                message: 'Vendor application submitted successfully for Admin review.'
            };
        }
    }

    const instance = new VendorsOnboarding();

    if (typeof window !== 'undefined' && window.LocalVendorsAssembly) {
        window.LocalVendorsAssembly.registerModule('onboarding', instance);
    }

    return instance;
}));
