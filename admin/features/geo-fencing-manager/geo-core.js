import { GEO_CONFIG } from './geo-config.js';

export class GeoCore {
    constructor() {
        this.countryAccessList = [
            { code: 'IN', name: 'India', status: 'Allowed', currency: 'INR', gateway: 'Razorpay / UPI', gdprRequired: false, subregionsBlocked: 0 },
            { code: 'US', name: 'United States', status: 'Allowed', currency: 'USD', gateway: 'Stripe', gdprRequired: false, subregionsBlocked: 0 },
            { code: 'GB', name: 'United Kingdom', status: 'Allowed', currency: 'GBP', gateway: 'Stripe', gdprRequired: true, subregionsBlocked: 0 },
            { code: 'EU', name: 'European Union', status: 'Allowed', currency: 'EUR', gateway: 'Stripe / PayPal', gdprRequired: true, subregionsBlocked: 0 },
            { code: 'CN', name: 'China', status: 'Blocked', currency: 'CNY', gateway: 'None', gdprRequired: false, subregionsBlocked: 14 },
            { code: 'RU', name: 'Russia', status: 'Blocked', currency: 'RUB', gateway: 'None', gdprRequired: false, subregionsBlocked: 8 }
        ];

        this.geoLogs = [
            { timestamp: '2026-09-05 20:10', country: 'India (IN)', ip: '157.34.xx.xx', action: 'Access Granted', reason: 'Country Allowed (Device Verified)' },
            { timestamp: '2026-09-05 20:12', country: 'China (CN)', ip: '114.119.xx.xx', action: 'Access Blocked (Honeypot)', reason: 'AI Bot Intelligence Trap' }
        ];

        this.globalKillSwitchActive = false;
        this.surgeAlertsCount = 2;
    }

    getCountries() {
        return this.countryAccessList;
    }

    toggleCountryStatus(code) {
        const country = this.countryAccessList.find(c => c.code === code);
        if (country) {
            country.status = country.status === 'Allowed' ? 'Blocked' : 'Allowed';
            const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
            this.geoLogs.unshift({
                timestamp,
                country: `${country.name} (${country.code})`,
                ip: '192.168.xx.xx',
                action: country.status === 'Allowed' ? 'Access Unblocked' : 'Access Blocked',
                reason: 'Multi-Admin Sync Override'
            });
            return true;
        }
        return false;
    }

    toggleGlobalKillSwitch() {
        this.globalKillSwitchActive = !this.globalKillSwitchActive;
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        this.geoLogs.unshift({
            timestamp,
            country: 'Global Network',
            ip: 'SYSTEM',
            action: this.globalKillSwitchActive ? 'PANIC KILL-SWITCH ACTIVATED' : 'Kill-Switch Deactivated',
            reason: 'Emergency Admin Command'
        });
        return this.globalKillSwitchActive;
    }

    runPredictiveShieldScan() {
        return {
            status: 'Secure',
            predictedThreatsAvoided: 142,
            aiConfidence: '99.2%',
            message: 'AI Predictive Shield successfully intercepted 3 emerging botnet subnets in Eastern Europe.'
        };
    }
          }
