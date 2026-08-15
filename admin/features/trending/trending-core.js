/**
 * Trending Core Engine
 * Path: admin/features/trending/trending-core.js
 */

import { TRENDING_CONFIG } from './trending-config.js';

export class TrendingCore {
  constructor() {
    this.heroBanners = [
      { id: 'HERO-101', title: 'Diwali Special Wishes 2026', status: 'Active', position: 1 },
      { id: 'HERO-102', title: 'New Year Greeting Cards', status: 'Scheduled', position: 2 }
    ];

    this.countdowns = [
      { id: 'CNT-01', event: 'Diwali 2026', targetDate: '2026-11-08T00:00:00', status: 'Running' }
    ];

    this.viralLeaderboard = [
      { templateId: 'TMPL-01', name: 'Golden Festive Wish', viralScore: 98.4, shares: 4500, views: 18200 },
      { templateId: 'TMPL-02', name: '3D Diya Animation Card', viralScore: 91.2, shares: 3100, views: 12400 }
    ];
  }

  getHeroBanners() { return this.heroBanners; }
  getCountdowns() { return this.countdowns; }
  getLeaderboard() { return this.viralLeaderboard; }

  calculateViralScore(views, shares, ageHours) {
    const baseScore = views * 0.3 + shares * 0.7;
    const decay = Math.pow(0.5, ageHours / TRENDING_CONFIG.timeDecayHalfLifeHours);
    return (baseScore * decay).toFixed(2);
  }
}

export const trendingCoreInstance = new TrendingCore();
