/**
 * @file affiliate-push-notifier.js
 * @description Price drop alerts and WhatsApp/Push broadcast broadcaster for Wishes Hub Affiliate Engine.
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
        root.AffiliatePushNotifier = factory(root.AffiliateConfig, root.AffiliateCore);
    }
}(typeof self !== 'undefined' ? self : this, function (AffiliateConfig, AffiliateCore) {
    'use strict';

    class PushNotifier {
        constructor() {
            this.config = AffiliateConfig;
            this.core = AffiliateCore;
        }

        /**
         * Initialize module lifecycle
         */
        async init(config, core) {
            this.config = config || this.config;
            this.core = core || this.core;
            this.core.log('PUSH_NOTIFIER', 'Push Notifier & Broadcast module loaded successfully.');
        }

        /**
         * Broadcast a deal alert via WhatsApp or Web Push payload
         * @param {Object} deal - Deal item to broadcast
         * @param {string} channel - 'whatsapp', 'telegram', or 'web_push'
         */
        generateBroadcastPayload(deal, channel = 'whatsapp') {
            if (!deal) return null;

            this.core.log('PUSH_NOTIFIER', `Generating broadcast payload for channel: ${channel}`, { dealId: deal.id });

            const title = deal.title || 'Special Deal';
            const price = deal.salePrice ? `₹${deal.salePrice}` : '';
            const origPrice = deal.originalPrice ? `₹${deal.originalPrice}` : '';
            const discount = deal.discount || '';
            const link = deal.affiliateUrl || '#';

            let formattedMessage = '';

            switch (channel.toLowerCase()) {
                case 'whatsapp':
                case 'telegram':
                    formattedMessage = `🔥 *${title}* 🔥\n\n` +
                        (origPrice ? `M.R.P: ~${origPrice}~\n` : '') +
                        `Deal Price: *${price}* ${discount ? `(${discount})` : ''}\n\n` +
                        `👉 Grab Now: ${link}\n\n` +
                        `_Sent via Wishes Hub Deals_`;
                    break;

                case 'web_push':
                    formattedMessage = {
                        title: `⚡ Price Drop Alert: ${title}`,
                        body: `Now available at ${price} (${discount}). Tap to grab!`,
                        url: link,
                        icon: deal.imageUrl || ''
                    };
                    break;

                default:
                    formattedMessage = `${title} - ${price} - ${link}`;
            }

            return formattedMessage;
        }

        /**
         * Simulate sending broadcast message via webhook or API
         * @param {Object} deal 
         * @param {string} channel 
         */
        async sendBroadcast(deal, channel = 'whatsapp') {
            const payload = this.generateBroadcastPayload(deal, channel);
            this.core.log('PUSH_NOTIFIER', `Broadcasting deal via ${channel}`, { payload });
            
            // Simulated broadcast success response
            return {
                success: true,
                channel: channel,
                timestamp: new Date().toISOString()
            };
        }
    }

    const instance = new PushNotifier();

    // Auto-register with Master Assembly if present
    if (typeof window !== 'undefined' && window.AffiliateAssembly) {
        window.AffiliateAssembly.registerModule('pushNotifier', instance);
    }

    return instance;
}));
