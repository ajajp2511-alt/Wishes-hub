import { SANDBOX_CONFIG } from './sandbox-config.js';

export class SandboxCore {
    constructor() {
        this.featureFlags = [
            { id: 'MOD-01', name: 'Support Manager & Google Sheets Sync', category: 'Support', status: true, rollout: 100, roleTarget: 'All' },
            { id: 'MOD-02', name: 'Wallets & Money Gifting Engine', category: 'Finance', status: true, rollout: 100, roleTarget: 'All' },
            { id: 'MOD-03', name: 'AI Gifting Suggestions & Voice Notes', category: 'AI Tools', status: false, rollout: 25, roleTarget: 'Beta Testers' },
            { id: 'MOD-04', name: 'Crypto Stablecoin Payouts (USDT)', category: 'Finance', status: false, rollout: 10, roleTarget: 'Admin Only' },
            { id: 'MOD-05', name: 'Gamified Spin & Win Bonus Rewards', category: 'Engagement', status: true, rollout: 50, roleTarget: 'Users' }
        ];

        this.auditLogs = [
            { timestamp: '2026-09-04 18:10', admin: 'Aarav (Lead)', action: 'Enabled Feature Flag: Gamified Spin & Win', status: 'Success' },
            { timestamp: '2026-09-04 19:00', admin: 'Aarav (Lead)', action: 'Triggered Circuit Breaker Reset for Crypto Payouts', status: 'Warning' }
        ];

        this.sandboxNotes = [
            { id: 'NOTE-101', author: 'Aarav', text: 'Check token fee split calculation on low-amount money wishes.', timestamp: '19:15' }
        ];

        this.simulationRole = 'Admin'; // Admin, Creator, Normal User
    }

    getFeatureFlags() {
        return this.featureFlags;
    }

    toggleFlag(id) {
        const flag = this.featureFlags.find(f => f.id === id);
        if (flag) {
            flag.status = !flag.status;
            const time = new Date().toISOString().replace('T', ' ').substring(0, 16);
            this.auditLogs.unshift({
                timestamp: time,
                admin: 'Current Admin',
                action: `Toggled ${flag.name} to ${flag.status ? 'ON' : 'OFF'}`,
                status: 'Success'
            });
            return true;
        }
        return false;
    }

    setSimulationRole(role) {
        this.simulationRole = role;
    }

    getSimulationRole() {
        return this.simulationRole;
    }

    addSandboxNote(text) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.sandboxNotes.push({ id: `NOTE-${Math.floor(100 + Math.random()*900)}`, author: 'Current Admin', text, timestamp: time });
        return true;
    }

    runAIRiskAssessment() {
        return {
            safetyScore: 94,
            riskLevel: 'Low',
            summary: 'All active feature flags have compatible dependencies. No data collision detected across Wallets and Support modules.'
        };
    }
                                            }
