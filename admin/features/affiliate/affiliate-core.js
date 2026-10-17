/**
 * @file affiliate-core.js
 * @description Central State Manager, Event Bus, and Pub/Sub Logger for the Wishes Hub Affiliate Engine.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./affiliate-config'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./affiliate-config'));
    } else {
        root.AffiliateCore = factory(root.AffiliateConfig);
    }
}(typeof self !== 'undefined' ? self : this, function (AffiliateConfig) {
    'use strict';

    class CoreState {
        constructor(config) {
            this.config = config || {};
            this.state = {
                activeCountry: this.config.localization?.defaultCountry || 'IN',
                activeCurrency: this.config.localization?.defaultCurrency || 'INR',
                userLocation: null,
                activeDeals: [],
                recentClicks: [],
                isLoading: false,
                lastSyncTime: null
            };
            this.listeners = {};
            this.logs = [];
        }

        // Event Listener Registration
        on(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
            return () => this.off(event, callback);
        }

        // Remove Listener
        off(event, callback) {
            if (!this.listeners[event]) return;
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }

        // Publish Event
        emit(event, data) {
            this.log('EVENT', `Event emitted: ${event}`, data);
            if (this.listeners[event]) {
                this.listeners[event].forEach(callback => {
                    try {
                        callback(data, this.state);
                    } catch (err) {
                        console.error(`[AffiliateCore] Error in listener for ${event}:`, err);
                    }
                });
            }
        }

        // Update State
        setState(updates) {
            const prevState = { ...this.state };
            this.state = { ...this.state, ...updates };
            this.log('STATE_CHANGE', 'State updated', { prevState, newState: this.state });
            this.emit('state:updated', { prevState, newState: this.state });
        }

        // Get Current State
        getState() {
            return { ...this.state };
        }

        // Core Logger
        log(type, message, details = null) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                type,
                message,
                details
            };
            this.logs.push(logEntry);
            if (this.logs.length > 200) {
                this.logs.shift(); // Keep memory lean
            }
        }

        // Fetch Event Logs
        getLogs() {
            return [...this.logs];
        }
    }

    const instance = new CoreState(AffiliateConfig);
    return instance;
}));
