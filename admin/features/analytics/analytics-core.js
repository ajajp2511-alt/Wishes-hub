/**
 * Analytics Core Engine
 * Path: admin/features/analytics/analytics-core.js
 */

export class AnalyticsCore {
  constructor() {
    this.liveData = {
      activeUsers: 142,
      todayWishes: 3840,
      whatsappShares: 2910,
      adRevenue: '$14.20'
    };
    this.topStates = [
      { state: 'Maharashtra', count: '38%' },
      { state: 'Gujarat', count: '24%' },
      { state: 'Uttar Pradesh', count: '18%' }
    ];
  }

  getLiveData() { return this.liveData; }
  getTopStates() { return this.topStates; }
}

export const analyticsCoreInstance = new AnalyticsCore();
