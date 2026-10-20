/**
 * festival-story-core.js
 * Main Orchestrator & Central Data Controller
 * Location: wishes-hub/admin/features/festival-storyteller/festival-story-core.js
 */

const FestivalStoryConfig = require('./festival-story-config');

class FestivalStoryCore {
  constructor() {
    this.config = FestivalStoryConfig;
    this.modules = {};
    this.activeFestival = null;
    this.currentLanguage = FestivalStoryConfig.routes.defaultLanguage;
    this.initialized = false;
  }

  /**
   * Register sub-modules into central core
   * @param {Object} moduleMap - Key-value pair of loaded module instances
   */
  registerModules(moduleMap) {
    this.modules = { ...this.modules, ...moduleMap };
  }

  /**
   * Initialize Core System
   */
  async init() {
    if (!this.config.enabled) {
      console.warn("[FestivalStoryCore] Module is disabled in config.");
      return false;
    }

    try {
      if (this.modules.dataManager) {
        await this.modules.dataManager.initCache();
      }
      
      this.initialized = true;
      console.log("[FestivalStoryCore] Core Engine Initialized Successfully.");
      return true;
    } catch (error) {
      console.error("[FestivalStoryCore] Initialization Error:", error);
      return false;
    }
  }

  /**
   * Load complete festival payload by slug/ID
   * @param {string} festivalSlug - Unique route slug (e.g., 'diwali', 'halloween')
   * @param {string} lang - Language code
   */
  async loadFestivalBySlug(festivalSlug, lang = this.currentLanguage) {
    if (!this.initialized) await this.init();

    this.currentLanguage = lang;
    
    // Fetch raw story data from data manager
    const rawData = this.modules.dataManager 
      ? await this.modules.dataManager.getFestivalData(festivalSlug)
      : null;

    if (!rawData) {
      throw new Error(`Festival data not found for slug: ${festivalSlug}`);
    }

    // Process and aggregate data through engines
    const processedStory = this.modules.contentEngine 
      ? this.modules.contentEngine.processContent(rawData, lang)
      : rawData;

    const ritualsData = this.modules.ritualsTraditions 
      ? this.modules.ritualsTraditions.processRituals(rawData)
      : {};

    const culinaryData = this.modules.culinaryAttire 
      ? this.modules.culinaryAttire.processCulinaryAndAttire(rawData)
      : {};

    const literatureData = this.modules.literatureAudio 
      ? this.modules.literatureAudio.processLiterature(rawData, lang)
      : {};

    const monetizationData = this.modules.monetizationAds 
      ? this.modules.monetizationAds.getAdPlacements(festivalSlug)
      : {};

    const affiliateData = this.modules.affiliateStore 
      ? this.modules.affiliateStore.getProducts(rawData.category, festivalSlug)
      : {};

    const businessLeads = this.modules.businessLeads 
      ? this.modules.businessLeads.getFeaturedVendors(festivalSlug)
      : {};

    // Combine into complete unified payload
    this.activeFestival = {
      slug: festivalSlug,
      language: lang,
      config: this.config,
      content: processedStory,
      rituals: ritualsData,
      culinary: culinaryData,
      literature: literatureData,
      monetization: {
        ads: monetizationData,
        affiliates: affiliateData,
        leads: businessLeads
      }
    };

    return this.activeFestival;
  }

  /**
   * Render complete page UI using Page Renderer
   * @param {string} festivalSlug 
   * @param {string} targetContainerId 
   */
  async renderFestivalPage(festivalSlug, targetContainerId) {
    const payload = await this.loadFestivalBySlug(festivalSlug);
    
    if (this.modules.pageRenderer) {
      return this.modules.pageRenderer.render(payload, targetContainerId);
    }
    
    throw new Error("[FestivalStoryCore] Page Renderer module not registered.");
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = FestivalStoryCore;
}
