/**
 * story-slug-router.js
 * Dynamic URL Routing & Dedicated Festival Page Slug Generator
 * Location: wishes-hub/admin/features/festival-storyteller/modules/story-slug-router.js
 */

const FestivalStoryConfig = require('../festival-story-config');

class StorySlugRouter {
  constructor() {
    this.config = FestivalStoryConfig;
  }

  /**
   * Clean string and convert into a sanitized URL slug
   * @param {string} text - Raw string title or name
   * @returns {string} Sanitized slug
   */
  generateSlug(text) {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\_\—\–]+/g, this.config.routes.slugSeparator || "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  /**
   * Build clean SEO route URL for individual festival page
   * @param {string} festivalSlug - Clean slug ID
   * @param {string} lang - Language code
   * @returns {string} Full path URL
   */
  getFestivalUrl(festivalSlug, lang = this.config.routes.defaultLanguage) {
    const sanitizedSlug = this.generateSlug(festivalSlug);
    const basePath = this.config.routes.basePath || "/festival";
    
    if (lang && lang !== this.config.routes.defaultLanguage) {
      return `${basePath}/${lang}/${sanitizedSlug}`;
    }
    return `${basePath}/${sanitizedSlug}`;
  }

  /**
   * Parse current window route or path string to extract festival slug and lang
   * @param {string} path - URL pathname
   * @returns {Object} Extracted params { slug, lang }
   */
  parseRoutePath(path) {
    if (!path) return { slug: null, lang: this.config.routes.defaultLanguage };

    const cleanPath = path.replace(/^\/|\/$/g, "");
    const segments = cleanPath.split("/");

    const basePath = (this.config.routes.basePath || "festival").replace(/\//g, "");
    
    // Remove base route prefix if present
    if (segments[0] === basePath) {
      segments.shift();
    }

    if (segments.length === 0) {
      return { slug: null, lang: this.config.routes.defaultLanguage };
    }

    // Check if first segment is a supported language code
    const isLang = this.config.supportedLanguages.some(l => l.code === segments[0]);
    
    if (isLang && segments.length > 1) {
      return {
        lang: segments[0],
        slug: segments[1]
      };
    }

    return {
      lang: this.config.routes.defaultLanguage,
      slug: segments[0]
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = StorySlugRouter;
}
