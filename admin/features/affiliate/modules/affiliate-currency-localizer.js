/**
 * @file affiliate-currency-localizer.js
 * @description Multi-currency converter and IP-based geo-location detection engine for Wishes Hub Affiliate Engine.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../affiliate-config', '../affiliate-core'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('../affiliate-config'),
            require('../affiliate-core')
        );
    } else {
        root.AffiliateCurrencyLocalizer = factory(root.AffiliateConfig, root.AffiliateCore);
    }
}(typeof self !== 'undefined' ? self : this, function (AffiliateConfig, AffiliateCore) {
    'use strict';

    class CurrencyLocalizer {
        constructor() {
            this.config = AffiliateConfig;
            this.core = AffiliateCore;
            
            // Base exchange rates against INR
            this.exchangeRates = {
                INR: 1,
                USD: 0.012,
                EUR: 0.011,
                GBP: 0.0095,
                AED: 0.044
            };

            this.currencySymbols = {
                INR: '₹',
                USD: '$',
                EUR: '€',
                GBP: '£',
                AED: 'AED '
            };
        }

        /**
         * Initialize module lifecycle
         */
        async init(config, core) {
            this.config = config || this.config;
            this.core = core || this.core;

            if (this.config.localization?.autoDetectIp) {
                await this.detectUserGeoLocation();
            }

            this.core.log('LOCALIZER', 'Currency Localizer module loaded successfully.');
        }

        /**
         * Detect user IP and set country/currency automatically
         */
        async detectUserGeoLocation() {
            try {
                this.core.log('LOCALIZER', 'Detecting user IP location...');
                const response = await fetch('https://ipapi.co/json/');
                
                if (response.ok) {
                    const geoData = await response.json();
                    const detectedCountry = geoData.country_code || 'IN';
                    const detectedCurrency = geoData.currency || 'INR';

                    const targetCurrency = this.config.localization?.supportedCurrencies.includes(detectedCurrency)
                        ? detectedCurrency
                        : 'USD';

                    this.core.setState({
                        activeCountry: detectedCountry,
                        activeCurrency: targetCurrency,
                        userLocation: geoData
                    });

                    this.core.log('LOCALIZER', `Location detected: ${detectedCountry}, Currency: ${targetCurrency}`);
                    this.core.emit('location:detected', { country: detectedCountry, currency: targetCurrency });
                }
            } catch (error) {
                this.core.log('ERROR', 'IP detection failed, defaulting to configuration defaults', error);
            }
        }

        /**
         * Convert price from source currency to target active currency
         * @param {number} amount - Numerical price
         * @param {string} fromCurrency - Original currency (e.g. 'INR')
         */
        convertPrice(amount, fromCurrency = 'INR') {
            const targetCurrency = this.core.getState().activeCurrency || 'INR';
            
            if (fromCurrency === targetCurrency) {
                return {
                    amount: amount,
                    formatted: `${this.currencySymbols[targetCurrency] || ''}${amount}`
                };
            }

            // Convert to base INR first, then to target
            const baseAmountInINR = amount / (this.exchangeRates[fromCurrency] || 1);
            const convertedAmount = Math.round(baseAmountInINR * (this.exchangeRates[targetCurrency] || 1));
            const symbol = this.currencySymbols[targetCurrency] || `${targetCurrency} `;

            return {
                amount: convertedAmount,
                formatted: `${symbol}${convertedAmount}`
            };
        }

        /**
         * Change current active currency manually
         * @param {string} newCurrency - Currency code (INR, USD, EUR, etc.)
         */
        setCurrency(newCurrency) {
            if (this.config.localization?.supportedCurrencies.includes(newCurrency)) {
                this.core.setState({ activeCurrency: newCurrency });
                this.core.log('LOCALIZER', `Currency updated to: ${newCurrency}`);
                this.core.emit('currency:changed', newCurrency);
            } else {
                console.warn(`[AffiliateCurrencyLocalizer] Unsupported currency: ${newCurrency}`);
            }
        }
    }

    const instance = new CurrencyLocalizer();

    // Auto-register with Master Assembly if present
    if (typeof window !== 'undefined' && window.AffiliateAssembly) {
        window.AffiliateAssembly.registerModule('currencyLocalizer', instance);
    }

    return instance;
}));
