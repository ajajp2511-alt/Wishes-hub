/**
 * story-data-manager.js
 * Local JSON & Global Dataset Fetcher/Cache
 * Location: wishes-hub/admin/features/festival-storyteller/modules/story-data-manager.js
 */

class StoryDataManager {
  constructor() {
    this.cache = new Map();
    this.isLoaded = false;
  }

  async initCache() {
    if (this.isLoaded) return true;
    console.log("[StoryDataManager] Initializing festival dataset cache...");
    this.isLoaded = true;
    return true;
  }

  async getFestivalData(slug) {
    if (!this.isLoaded) await this.initCache();

    if (this.cache.has(slug)) {
      return this.cache.get(slug);
    }

    const festivalMockData = this._fetchMockDatabase(slug);
    if (festivalMockData) {
      this.cache.set(slug, festivalMockData);
      return festivalMockData;
    }

    return null;
  }

  _fetchMockDatabase(slug) {
    const mockDatabase = {
      "diwali": {
        slug: "diwali",
        title: "Diwali - Festival of Lights",
        category: "religious",
        originCountry: "India",
        era: "Ancient",
        summary: "Diwali symbolizes the spiritual victory of light over darkness, good over evil, and knowledge over ignorance.",
        history: "Lord Rama returned to Ayodhya after 14 years of exile and defeating Ravana.",
        rituals: ["Lighting diyas", "Lakshmi Puja", "Rangoli creation", "Bursting safe fireworks"],
        foods: ["Kaju Katli", "Gulab Jamun", "Chivda"],
        attire: ["Traditional Kurta Pyjama", "Silk Saree"]
      },
      "halloween": {
        slug: "halloween",
        title: "Halloween - All Hallows' Eve",
        category: "cultural",
        originCountry: "Ireland / Global",
        era: "Medieval",
        summary: "Halloween is a celebration observed in many countries on the eve of Western Christian feast of All Hallows' Day.",
        history: "Derived from Celtic harvest festivals, particularly Samhain.",
        rituals: ["Trick-or-treating", "Carving jack-o'-lanterns", "Costume parties"],
        foods: ["Candy corn", "Toffee apples", "Pumpkin pie"],
        attire: ["Costumes", "Witch hats", "Ghost cloaks"]
      }
    };

    return mockDatabase[slug] || {
      slug: slug,
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      category: "cultural",
      originCountry: "Global",
      summary: "Comprehensive festival story, history, rituals, and cultural significance.",
      history: "Historical background and ancient traditions.",
      rituals: ["Traditional celebration steps"],
      foods: ["Special delicacies"],
      attire: ["Traditional outfits"]
    };
  }

  async saveFestivalData(slug, data) {
    this.cache.set(slug, data);
    console.log(`[StoryDataManager] Festival data updated for slug: ${slug}`);
    return true;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = StoryDataManager;
}
