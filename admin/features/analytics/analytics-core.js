/**
 * Analytics Core Engine (Optimized & Upgraded)
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

  getLiveData() {
    // Return a shallow clone to prevent external mutation
    return { ...this.liveData };
  }

  getTopStates() {
    // Return a deep copy of the states array
    return this.topStates.map(item => ({ ...item }));
  }

  // Method to simulate incoming real-time traffic updates
  refreshLiveMetrics() {
    const fluctuation = Math.floor(Math.random() * 11) - 5; // -5 to +5
    this.liveData.activeUsers = Math.max(50, this.liveData.activeUsers + fluctuation);
    this.liveData.todayWishes += Math.floor(Math.random() * 3);
    return this.getLiveData();
  }
}

export const analyticsCoreInstance = new AnalyticsCore();
