/**
 * Wishes Hub - Ads Management Module Configuration
 * File: admin/features/ads/ads-config.js
 * Description: Master configuration containing ad zones, pricing tiers, 
 *              area multipliers, AI generation credits, and system defaults.
 */

export const ADS_CONFIG = {
  // Module Identifier
  MODULE_NAME: 'ads_management_system',
  VERSION: '1.0.0',

  // Local Storage Keys
  STORAGE_KEYS: {
    ACTIVE_ADS: 'wishes_hub_ads_active',
    PENDING_REQUESTS: 'wishes_hub_ads_pending_requests',
    DRAFTS: 'wishes_hub_ads_drafts',
    ADVERTISERS: 'wishes_hub_ads_advertisers',
    CONFIG_OVERRIDE: 'wishes_hub_ads_custom_config'
  },

  // Google Sheets Integration for Free Template Fallback
  FREE_TEMPLATES_SHEET: {
    API_ENDPOINT: 'https://gsheet-sync.wishes-hub.com/v1/free-ad-templates',
    SYNC_INTERVAL_MS: 3600000, // 1 Hour
    FALLBACK_LOCAL: true
  },

  // AI Ad Generation Limits & Pricing
  AI_GENERATOR: {
    MAX_FREE_RETRIES: 1, // 1st Retry Free
    PAID_RETRY_COST_INR: 49, // Cost per extra retry after free credit
    IMAGE_ASPECT_RATIO: '16:9',
    VIDEO_MAX_DURATION_SEC: 10
  },

  // Ad Placement Zones
  ZONES: {
    WISH_HEADER: {
      id: 'wish_header',
      label: 'Wish Page Top Banner',
      supportedTypes: ['image', 'video'],
      dimensions: '728x90',
      basePricePerDay: 50
    },
    WISH_FOOTER: {
      id: 'wish_footer',
      label: 'Wish Page Bottom Sticky',
      supportedTypes: ['image'],
      dimensions: '320x50',
      basePricePerDay: 30
    },
    PRE_ROLL_VIDEO: {
      id: 'pre_roll_video',
      label: 'Pre-Wish Opening Video Teaser',
      supportedTypes: ['video'],
      dimensions: '1080x1920',
      basePricePerDay: 100
    },
    POPUP_MODAL: {
      id: 'popup_modal',
      label: 'Festival Greeting Popup',
      supportedTypes: ['image', 'video'],
      dimensions: '600x600',
      basePricePerDay: 80
    }
  },

  // Area / Radius Pricing Multipliers
  AREA_MULTIPLIERS: {
    SINGLE_PINCODE: { id: 'pincode', label: 'Single Pincode / Local Market', multiplier: 1.0 },
    CITY_WIDE: { id: 'city', label: 'Whole City', multiplier: 2.2 },
    MULTI_DISTRICT: { id: 'district', label: 'Multi-District Region', multiplier: 4.5 },
    STATE_WIDE: { id: 'state', label: 'State-wide Coverage', multiplier: 8.0 }
  },

  // Default Package Plans (Admin Customizable)
  PACKAGE_PLANS: [
    {
      id: 'plan_starter',
      name: 'Local Business Starter',
      days: 7,
      discountPercent: 0,
      badge: 'Popular for Shops'
    },
    {
      id: 'plan_growth',
      name: 'City Express Boost',
      days: 30,
      discountPercent: 15,
      badge: 'Best Value'
    },
    {
      id: 'plan_festival',
      name: 'Festival Special Pass',
      days: 15,
      discountPercent: 25,
      badge: 'High Conversion'
    }
  ],

  // Ad Status Lifecycle Flags
  STATUS: {
    DRAFT: 'DRAFT',
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    FREE_TEMPLATE_REQUEST: 'FREE_TEMPLATE_REQUEST',
    ACTIVE: 'ACTIVE',
    PAUSED: 'PAUSED',
    EXPIRED: 'EXPIRED',
    REJECTED: 'REJECTED'
  }
};
