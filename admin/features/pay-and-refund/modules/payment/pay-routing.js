/**
 * Module: pay-and-refund
 * Sub-folder: payment/
 * File: pay-routing.js
 * Description: Smart gateway routing, failover & dynamic retry engine.
 */

class PayRouting {
    constructor() {
        this.gatewayHealth = {
            'razorpay': { active: true, latencyMs: 120, priority: 1 },
            'stripe': { active: true, latencyMs: 150, priority: 2 },
            'coinbase': { active: true, latencyMs: 300, priority: 3 }
        };
    }

    /**
     * Select the optimal gateway based on currency, region, and health status
     */
    selectOptimalRoute(params) {
        const { currency = 'INR', paymentMethod = 'card' } = params;

        if (paymentMethod === 'crypto') {
            return { primaryGateway: 'coinbase', fallbackGateway: null };
        }

        if (currency === 'INR') {
            return {
                primaryGateway: this.gatewayHealth['razorpay'].active ? 'razorpay' : 'stripe',
                fallbackGateway: 'stripe'
            };
        }

        return {
            primaryGateway: this.gatewayHealth['stripe'].active ? 'stripe' : 'razorpay',
            fallbackGateway: 'razorpay'
        };
    }

    markGatewayFailure(gatewayName) {
        if (this.gatewayHealth[gatewayName]) {
            this.gatewayHealth[gatewayName].active = false;
        }
    }
}

module.exports = new PayRouting();
