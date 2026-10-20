/**
 * festival-story-config.js
 * Central Configuration for Festival Storyteller Module
 * Location: wishes-hub/admin/features/festival-storyteller/festival-story-config.js
 */

const FestivalStoryConfig = {
  moduleName: "Festival Storyteller & Cultural Engine",
  version: "1.0.0",
  enabled: true,

  // Base SEO & Route Setup
  routes: {
    basePath: "/festival",
    slugSeparator: "-",
    defaultLanguage: "hi",
    fallbackLanguage: "en"
  },

  // Supported Categories across Global & National Level
  categories: [
    { id: "religious", label: "Dharmik / Religious", icon: "🛕" },
    { id: "cultural", label: "Sanskritik / Cultural", icon: "🎭" },
    { id: "harvest", label: "Fasal / Harvest", icon: "🌾" },
    { id: "national", label: "Rashtriya / National", icon: "🇮🇳" },
    { id: "international", label: "Global / Worldwide", icon: "🌍" },
    { id: "seasonal", label: "Rutu / Seasonal", icon: "🍂" }
  ],

  // Supported Languages for Storytelling
  supportedLanguages: [
    { code: "hi", name: "Hindi", isDefault: true },
    { code: "en", name: "English", isDefault: false },
    { code: "mr", name: "Marathi", isDefault: false },
    { code: "gu", name: "Gujarati", isDefault: false },
    { code: "bn", name: "Bengali", isDefault: false },
    { code: "ta", name: "Tamil", isDefault: false }
  ],

  // Default Display Flags for UI Components
  featuresEnabled: {
    originStory: true,
    ritualsAndVidhi: true,
    regionalVariations: true,
    traditionalFoods: true,
    poetryAndAartis: true,
    audioStory: true,
    kidsMode: true,
    virtualRitual: true,
    monetizationAds: true,
    affiliateStore: true,
    localBusinessLeads: true,
    directWishCTA: true
  },

  // Ad Slot Placements Configuration
  adSlots: {
    headerBanner: "ad-slot-festival-header",
    inStoryMiddle: "ad-slot-festival-mid-story",
    sidebarSponsor: "ad-slot-festival-sidebar",
    footerBanner: "ad-slot-festival-footer"
  },

  // Default Affiliate Settings
  affiliateConfig: {
    amazonTag: "wisprompt-21",
    enablePujaKits: true,
    enableGiftHampers: true
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = FestivalStoryConfig;
}
