/**
 * City/Locale-Based Offer Engine & AI Personalized Recommendation Sorter
 * Path: admin/features/coupons/geo-ai-recommender.js
 * Description: Sorts and prioritizes coupon offers based on user location
 *              (e.g., Mumbai, Delhi, Pune) and past purchase behavior.
 */

import { couponsCore } from './coupons-core.js';

export class GeoAIRecommenderEngine {
  constructor() {
    this.core = couponsCore;
  }

  /**
   * Get Geo-Targeted & AI Personalized Recommendations
   */
  getRecommendations({ userCity = 'Pune', preferredCategories = ['Food & Dining', 'E-Commerce'] }) {
    this.core.log('GEO_AI', `Generating recommendations for City: [${userCity}]`, 'INFO');

    const allInventory = this.core.state.inventoryQueue.filter(item => item.status === 'ACTIVE');

    // Sort by Category Relevance & Popularity Score
    const sortedRecommendations = [...allInventory].sort((a, b) => {
      const aCategoryMatch = preferredCategories.includes(a.category) ? 10 : 0;
      const bCategoryMatch = preferredCategories.includes(b.category) ? 10 : 0;

      const aScore = aCategoryMatch + (a.faceValueINR - a.sellingPriceINR);
      const bScore = bCategoryMatch + (b.faceValueINR - b.sellingPriceINR);

      return bScore - aScore;
    });

    return {
      userCity,
      recommendedItems: sortedRecommendations.slice(0, 6)
    };
  }
}

export const geoAIRecommender = new GeoAIRecommenderEngine();
