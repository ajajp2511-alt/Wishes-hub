/**
 * story-language-translator.js
 * Multi-Language Translation & Localization Engine
 * Location: wishes-hub/admin/features/festival-storyteller/modules/story-language-translator.js
 */

const FestivalStoryConfig = require('../festival-story-config');

class StoryLanguageTranslator {
  constructor() {
    this.name = "StoryLanguageTranslator";
    this.config = FestivalStoryConfig;
    this.translationsCache = new Map();
  }

  /**
   * Translate text string or payload key based on target language code
   * @param {string} text - Raw content text
   * @param {string} targetLang - Target language code ('hi', 'en', 'mr', 'gu', etc.)
   * @returns {string} Translated content string
   */
  translateText(text, targetLang = this.config.routes.defaultLanguage) {
    if (!text) return "";
    
    // If target language is default language or unsupported, return original text
    if (targetLang === this.config.routes.defaultLanguage) {
      return text;
    }

    const cacheKey = `${targetLang}:${text}`;
    if (this.translationsCache.has(cacheKey)) {
      return this.translationsCache.get(cacheKey);
    }

    // Static translation dictionary fallback for UI components
    const dictionary = {
      mr: {
        "History & Katha": "इतिहास आणि कथा",
        "Rituals & Traditions": "रीती आणि परंपरा",
        "Traditional Delicacies": "पारंपारिक पदार्थ",
        "Virtual Puja Experience": "व्हर्च्युअल पूजा अनुभव"
      },
      gu: {
        "History & Katha": "ઇતિહાસ અને કથા",
        "Rituals & Traditions": "રીત-રિવાજો અને પરંપરાઓ",
        "Traditional Delicacies": "પરંપરાગત વાનગીઓ",
        "Virtual Puja Experience": "વર્ચ્યુઅલ પૂજા અનુભવ"
      },
      en: {
        "History & Katha": "History & Origin Narrative",
        "Rituals & Traditions": "Rituals & Traditional Customs",
        "Traditional Delicacies": "Festive Delicacies & Recipes",
        "Virtual Puja Experience": "Virtual Puja & Interactive Ritual"
      }
    };

    const translated = dictionary[targetLang]?.[text] || text;
    this.translationsCache.set(cacheKey, translated);
    return translated;
  }

  /**
   * Process complete story payload and translate key sections
   * @param {Object} storyPayload - Full story payload object
   * @param {string} targetLang - Target language code
   * @returns {Object} Translated story payload
   */
  translatePayload(storyPayload, targetLang) {
    if (!storyPayload || targetLang === this.config.routes.defaultLanguage) {
      return storyPayload;
    }

    return {
      ...storyPayload,
      language: targetLang,
      translatedSections: {
        historyTitle: this.translateText("History & Katha", targetLang),
        ritualsTitle: this.translateText("Rituals & Traditions", targetLang),
        delicaciesTitle: this.translateText("Traditional Delicacies", targetLang),
        virtualPujaTitle: this.translateText("Virtual Puja Experience", targetLang)
      }
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = StoryLanguageTranslator;
}
