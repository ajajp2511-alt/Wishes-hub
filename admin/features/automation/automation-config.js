/**
 * Automation Module Configuration Master
 * Path: admin/features/automation/automation-config.js
 * Description: Master configuration store for festival calendars, AI prompts, allowed countries,
 *              3D pricing tiers, viral mechanics, and self-service sponsor rules.
 */

export const AUTOMATION_CONFIG = {
  // Module Core Identity
  moduleName: 'Automated Content & B2B Monetization Engine',
  version: '2.5.0-production',
  storageKey: 'wishes_hub_automation_state_v2',

  // Allowed Countries Whitelist & Regional Defaults
  countryWhitelist: [
    { code: 'IN', name: 'India', defaultLanguage: 'hi', currency: 'INR', symbol: '₹' },
    { code: 'US', name: 'United States', defaultLanguage: 'en', currency: 'USD', symbol: '$' },
    { code: 'AE', name: 'United Arab Emirates', defaultLanguage: 'ar', currency: 'AED', symbol: 'AED ' },
    { code: 'GB', name: 'United Kingdom', defaultLanguage: 'en', currency: 'GBP', symbol: '£' },
    { code: 'CA', name: 'Canada', defaultLanguage: 'en', currency: 'CAD', symbol: 'CA$' },
    { code: 'AU', name: 'Australia', defaultLanguage: 'en', currency: 'AUD', symbol: 'A$' }
  ],

  // Default Whitelist Filter Settings
  allowedCountries: ['IN', 'US', 'AE', 'GB', 'CA', 'AU'],

  // Multi-Tier Festival Database (Global, National, Regional)
  festivalMasterDatabase: [
    // Tier 1 - Major Global / High Traffic
    {
      id: 'fest_diwali',
      name: 'Diwali - Festival of Lights',
      tier: 1,
      countryCodes: ['IN', 'US', 'AE', 'GB', 'CA', 'AU'],
      category: 'Festive',
      defaultDate: '11-01', // MMDD
      leadDaysTrigger: 10,
      supportedLangs: ['hi', 'en', 'gu', 'mr', 'ta'],
      themeColor: '#ff9900',
      has3DSupport: true,
      audioTrack: 'diwali_sitar_ambient.mp3',
      defaultGame: 'light_the_diya'
    },
    {
      id: 'fest_newyear',
      name: 'New Year Celebration',
      tier: 1,
      countryCodes: ['IN', 'US', 'AE', 'GB', 'CA', 'AU'],
      category: 'Global Event',
      defaultDate: '01-01',
      leadDaysTrigger: 12,
      supportedLangs: ['en', 'hi', 'es', 'fr', 'ar'],
      themeColor: '#10b981',
      has3DSupport: true,
      audioTrack: 'fireworks_symphony.mp3',
      defaultGame: 'balloon_pop'
    },
    {
      id: 'fest_christmas',
      name: 'Christmas Festival',
      tier: 1,
      countryCodes: ['US', 'GB', 'CA', 'AU', 'IN'],
      category: 'Festive',
      defaultDate: '12-25',
      leadDaysTrigger: 10,
      supportedLangs: ['en', 'es', 'fr', 'hi'],
      themeColor: '#ef4444',
      has3DSupport: true,
      audioTrack: 'jingle_bells_3d.mp3',
      defaultGame: 'snow_blaster'
    },

    // Tier 2 - Cultural & National Days
    {
      id: 'fest_eid',
      name: 'Eid-ul-Fitr',
      tier: 2,
      countryCodes: ['IN', 'AE', 'US', 'GB'],
      category: 'Festive',
      defaultDate: '04-10',
      leadDaysTrigger: 8,
      supportedLangs: ['ar', 'hi', 'ur', 'en'],
      themeColor: '#059669',
      has3DSupport: true,
      audioTrack: 'eid_arabic_flute.mp3',
      defaultGame: 'crescent_catch'
    },
    {
      id: 'fest_holi',
      name: 'Holi - Festival of Colors',
      tier: 2,
      countryCodes: ['IN', 'US', 'CA', 'GB'],
      category: 'Festive',
      defaultDate: '03-25',
      leadDaysTrigger: 7,
      supportedLangs: ['hi', 'en', 'mr'],
      themeColor: '#ec4899',
      has3DSupport: true,
      audioTrack: 'dhol_festive_beat.mp3',
      defaultGame: 'color_splash'
    },
    {
      id: 'fest_thanksgiving',
      name: 'Thanksgiving Day',
      tier: 2,
      countryCodes: ['US', 'CA'],
      category: 'Cultural',
      defaultDate: '11-26',
      leadDaysTrigger: 7,
      supportedLangs: ['en'],
      themeColor: '#d97706',
      has3DSupport: false,
      audioTrack: 'harvest_acoustic.mp3',
      defaultGame: 'turkey_catch'
    },

    // Tier 3 - Local / Regional Events
    {
      id: 'fest_ganesh_chaturthi',
      name: 'Ganesh Chaturthi',
      tier: 3,
      countryCodes: ['IN'],
      category: 'Regional Festive',
      defaultDate: '09-07',
      leadDaysTrigger: 5,
      supportedLangs: ['mr', 'hi', 'en'],
      themeColor: '#f59e0b',
      has3DSupport: true,
      audioTrack: 'dhol_tasha_fusion.mp3',
      defaultGame: 'modak_collector'
    },
    {
      id: 'fest_friendship_day',
      name: 'International Friendship Day',
      tier: 3,
      countryCodes: ['IN', 'US', 'AE', 'GB', 'CA', 'AU'],
      category: 'Special Days',
      defaultDate: '08-04',
      leadDaysTrigger: 5,
      supportedLangs: ['en', 'hi'],
      themeColor: '#3b82f6',
      has3DSupport: true,
      audioTrack: 'upbeat_friendship.mp3',
      defaultGame: 'friendship_band_puzzle'
    }
  ],

  // 3D Immersive Wish Pricing & Monetization Config
  monetization3D: {
    enabled: true,
    currencyDefaults: {
      INR: { price: 29, compareAt: 99, symbol: '₹' },
      USD: { price: 0.99, compareAt: 2.99, symbol: '$' },
      AED: { price: 3.99, compareAt: 9.99, symbol: 'AED ' },
      GBP: { price: 0.89, compareAt: 2.49, symbol: '£' }
    },
    shareToUnlockFreeThreshold: 3, // Sharing in 3 WhatsApp groups unlocks free 3D theme
    freePromotionalSlotsRemaining: 100
  },

  // Self-Service Marketing Sponsorship & Local Business Packages
  marketingSponsorship: {
    enabled: true,
    strictCategoryFilter: 'Marketing',
    packages: [
      {
        id: 'pkg_festive_starter',
        name: 'Local Shop Festival Pass',
        durationDays: 7,
        priceINR: 499,
        features: ['Logo Overlay on Wish Cards', 'WhatsApp Lead Capture Popup', '100 QR Coupon Scans']
      },
      {
        id: 'pkg_festive_viral_pro',
        name: 'Enterprise Viral Co-Sponsor Pass',
        durationDays: 15,
        priceINR: 1499,
        features: ['3D Immersive Scene Logo Placement', 'WhatsApp Performance Analytics', 'Pre-Festival WhatsApp Broadcasts', 'Unlimited QR Coupon Scans']
      }
    ]
  },

  // Safety & Abuse Filters
  contentGuardRules: {
    blockOffensiveNames: true,
    blockedKeywords: ['abuse', 'hate', 'fake', 'scam', 'badword1', 'badword2'],
    maxNameLength: 32
  },

  // Default Pipeline System Timers
  autoPublishSettings: {
    draftLeadTimeHours: 48,
    autoArchiveAfterDays: 3,
    pushNotificationLeadHours: 24
  }
};
