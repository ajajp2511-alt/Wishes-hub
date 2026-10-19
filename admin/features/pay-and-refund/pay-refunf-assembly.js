/**
 * Module: pay-and-refund
 * File: pay-refund-assembly.js
 * Description: Master assembly and single-entry exporter for WishesPay Global Engine.
 */

const core = require('./pay-refund-core');
const config = require('./pay-refund-config');

// Import Modules
const taxModule = require('./modules/pay-refund-tax');
const surchargeModule = require('./modules/pay-refund-surcharge');
const pppModule = require('./modules/pay-refund-ppp');
const routingModule = require('./modules/pay-refund-routing');
const currencyModule = require('./modules/pay-refund-currency');
const subscriptionModule = require('./modules/pay-refund-subscription');
const splitModule = require('./modules/pay-refund-split');
const fiatAdapter = require('./modules/pay-refund-adapter-fiat');
const cryptoAdapter = require('./modules/pay-refund-adapter-crypto');
const processorModule = require('./modules/pay-refund-processor');
const invoiceModule = require('./modules/pay-refund-invoice');
const abandonedModule = require('./modules/pay-refund-abandoned');
const webhookModule = require('./modules/pay-refund-webhook');

class PayRefundAssembly {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize the entire payment and refund orchestration ecosystem
     */
    init(customConfig = {}) {
        const mergedConfig = { ...config, ...customConfig };
        core.initialize(mergedConfig);
        
        this.initialized = true;
        core.logEvent('ASSEMBLY_INITIALIZED', { status: 'SUCCESS' });
        
        return {
            status: 'SUCCESS',
            message: 'WishesPay & Refund Assembly loaded successfully with all enterprise modules.',
            modulesLoaded: 13
        };
    }
}

module.exports = {
    assembly: new PayRefundAssembly(),
    core,
    config,
    modules: {
        tax: taxModule,
        surcharge: surchargeModule,
        ppp: pppModule,
        routing: routingModule,
        currency: currencyModule,
        subscription: subscriptionModule,
        split: splitModule,
        fiatAdapter,
        cryptoAdapter,
        processor: processorModule,
        invoice: invoiceModule,
        abandoned: abandonedModule,
        webhook: webhookModule
    }
};
