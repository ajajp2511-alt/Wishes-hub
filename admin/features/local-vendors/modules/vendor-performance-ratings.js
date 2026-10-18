/**
 * Wishes Hub - Vendor Performance & Quality Ratings Engine Module
 * File: modules/vendor-performance-ratings.js
 */

import { coreEngine } from '../local-vendors-core.js';

export class VendorPerformanceRatingsModule {
  constructor() {
    this.moduleName = 'vendor-performance-ratings';
  }

  /**
   * Submit rating and feedback for a vendor or housewife after delivery
   * @param {Object} ratingParams 
   * @returns {Object} Updated score and status
   */
  submitRating(ratingParams) {
    const { vendorId, orderId, rating, comments, productQualityScore, packagingScore, deliverySpeedScore } = ratingParams;

    if (!vendorId || !orderId) {
      throw new Error('Vendor ID and Order ID are required to submit feedback.');
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      throw new Error('Rating must be a number between 1 and 5 stars.');
    }

    const vendor = coreEngine.state.activeVendors.get(vendorId);
    if (!vendor) {
      throw new Error(`Vendor not found with ID: ${vendorId}`);
    }

    // Initialize metrics if not already set
    if (!vendor.performanceMetrics) {
      vendor.performanceMetrics = {
        totalReviews: 0,
        averageRating: 5.0,
        completedOrdersCount: 0,
        rejectedOrdersCount: 0,
        qualityScore: 5.0,
        reviewsHistory: []
      };
    }

    const metrics = vendor.performanceMetrics;

    // Calculate new average rating
    const currentTotalScore = metrics.averageRating * metrics.totalReviews;
    metrics.totalReviews += 1;
    metrics.averageRating = Number(((currentTotalScore + numericRating) / metrics.totalReviews).toFixed(2));

    // Append review record
    const reviewRecord = {
      orderId,
      rating: numericRating,
      scores: {
        productQuality: Number(productQualityScore) || numericRating,
        packaging: Number(packagingScore) || numericRating,
        deliverySpeed: Number(deliverySpeedScore) || numericRating
      },
      comments: comments || '',
      submittedAt: new Date().toISOString()
    };

    metrics.reviewsHistory.push(reviewRecord);

    // Save updated state
    coreEngine.setVendorState(vendorId, vendor);

    return {
      success: true,
      vendorId,
      newAverageRating: metrics.averageRating,
      totalReviews: metrics.totalReviews,
      message: 'Vendor performance rating submitted successfully.'
    };
  }

  /**
   * Retrieve aggregated rating and trust badge for vendor profile
   * @param {String} vendorId 
   * @returns {Object} Vendor rating profile
   */
  getVendorRatingProfile(vendorId) {
    const vendor = coreEngine.state.activeVendors.get(vendorId);
    if (!vendor) {
      throw new Error(`Vendor not found with ID: ${vendorId}`);
    }

    const metrics = vendor.performanceMetrics || {
      totalReviews: 0,
      averageRating: 5.0,
      reviewsHistory: []
    };

    let trustBadge = 'NEW_SELLER';
    if (metrics.totalReviews >= 10 && metrics.averageRating >= 4.5) {
      trustBadge = 'SUPER_VENDOR';
    } else if (metrics.totalReviews >= 5 && metrics.averageRating >= 4.0) {
      trustBadge = 'VERIFIED_PARTNER';
    }

    return {
      vendorId,
      businessName: vendor.businessName,
      vendorType: vendor.vendorType,
      averageRating: metrics.averageRating,
      totalReviews: metrics.totalReviews,
      trustBadge,
      recentReviews: metrics.reviewsHistory.slice(-5)
    };
  }
}

export const vendorPerformanceRatings = new VendorPerformanceRatingsModule();
