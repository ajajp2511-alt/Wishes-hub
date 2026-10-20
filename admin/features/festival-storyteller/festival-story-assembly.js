/**
 * festival-story-assembly.js
 * Master Export & Assembly Integration File
 * Location: wishes-hub/admin/features/festival-storyteller/festival-story-assembly.js
 */

const FestivalStoryConfig = require('./festival-story-config');
const FestivalStoryCore = require('./festival-story-core');

// Sub-modules Import
const StoryDataManager = require('./modules/story-data-manager');
const StorySlugRouter = require('./modules/story-slug-router');
const StoryContentEngine = require('./modules/story-content-engine');
const StoryRitualsTraditions = require('./modules/story-rituals-traditions');
const StoryCulinaryAttire = require('./modules/story-culinary-attire');
const StoryLiteratureAudio = require('./modules/story-literature-audio');
const StoryAstronomyDestinations = require('./modules/story-astronomy-destinations');
const StoryCultureMap = require('./modules/story-culture-map');
const StorySocialCards = require('./modules/story-social-cards');
const StoryVirtualRitual = require('./modules/story-virtual-ritual');
const StoryLanguageTranslator = require('./modules/story-language-translator');
const StoryMonetizationAds = require('./modules/story-monetization-ads');
const StoryAffiliateStore = require('./modules/story-affiliate-store');
const StoryBusinessLeads = require('./modules/story-business-leads');
const StoryPageRenderer = require('./modules/story-page-renderer');
const StoryAdminCMS = require('./modules/story-admin-cms');

class FestivalStoryAssembly {
  constructor() {
    this.config = FestivalStoryConfig;
    this.core = new FestivalStoryCore();
    
    // Instantiating all sub-modules
    this.dataManager = new StoryDataManager();
    this.slugRouter = new StorySlugRouter();
    this.contentEngine = new StoryContentEngine();
    this.ritualsTraditions = new StoryRitualsTraditions();
    this.culinaryAttire = new StoryCulinaryAttire();
    this.literatureAudio = new StoryLiteratureAudio();
    this.astronomyDestinations = new StoryAstronomyDestinations();
    this.cultureMap = new StoryCultureMap();
    this.socialCards = new StorySocialCards();
    this.virtualRitual = new StoryVirtualRitual();
    this.languageTranslator = new StoryLanguageTranslator();
    this.monetizationAds = new StoryMonetizationAds();
    this.affiliateStore = new StoryAffiliateStore();
    this.businessLeads = new StoryBusinessLeads();
    this.pageRenderer = new StoryPageRenderer();
    this.adminCMS = new StoryAdminCMS();

    // Assemble everything into central core
    this.core.registerModules({
      dataManager: this.dataManager,
      slugRouter: this.slugRouter,
      contentEngine: this.contentEngine,
      ritualsTraditions: this.ritualsTraditions,
      culinaryAttire: this.culinaryAttire,
      literatureAudio: this.literatureAudio,
      astronomyDestinations: this.astronomyDestinations,
      cultureMap: this.cultureMap,
      socialCards: this.socialCards,
      virtualRitual: this.virtualRitual,
      languageTranslator: this.languageTranslator,
      monetizationAds: this.monetizationAds,
      affiliateStore: this.affiliateStore,
      businessLeads: this.businessLeads,
      pageRenderer: this.pageRenderer,
      adminCMS: this.adminCMS
    });
  }

  /**
   * Bootstraps the complete module ecosystem
   */
  async bootstrap() {
    console.log("[FestivalStoryAssembly] Assembling and bootstrapping sub-modules...");
    const initialized = await this.core.init();
    if (initialized) {
      console.log("[FestivalStoryAssembly] Module Assembly Completed Successfully.");
    } else {
      console.error("[FestivalStoryAssembly] Bootstrap failed during Core initialization.");
    }
    return initialized;
  }

  /**
   * Get Core Instance
   */
  getCoreInstance() {
    return this.core;
  }
}

// Global Singleton Instance
const instance = new FestivalStoryAssembly();

if (typeof module !== "undefined" && module.exports) {
  module.exports = instance;
}
