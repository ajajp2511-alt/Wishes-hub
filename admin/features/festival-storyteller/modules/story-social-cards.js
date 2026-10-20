/**
 * story-social-cards.js
 * Memory Wall, Community Photos & Status/Story Card Generator
 * Location: wishes-hub/admin/features/festival-storyteller/modules/story-social-cards.js
 */

class StorySocialCards {
  constructor() {
    this.name = "StorySocialCards";
  }

  /**
   * Process social cards, status graphic templates, and community memory wall feeds
   * @param {Object} rawData - Raw festival dataset
   * @returns {Object} Structured social cards and memory wall payload
   */
  processSocialCards(rawData) {
    if (!rawData) return {};

    const festivalTitle = rawData.title || "Festival";
    const slug = rawData.slug || "festival";

    return {
      cardTemplates: [
        {
          id: `${slug}-card-quote`,
          type: "Instagram Story / WhatsApp Status",
          dimensions: "1080x1920",
          headline: `Did You Know? ${festivalTitle}`,
          quoteText: rawData.summary || "Celebrate love, unity, and heritage.",
          backgroundImage: `/assets/images/social/${slug}-story-bg.jpg`,
          downloadUrl: `/api/social/generate-card?slug=${slug}&template=story`
        },
        {
          id: `${slug}-card-greeting`,
          type: "Square Post",
          dimensions: "1080x1080",
          headline: `Happy ${festivalTitle}!`,
          quoteText: "Wishing you peace, prosperity, and joy on this sacred occasion.",
          backgroundImage: `/assets/images/social/${slug}-post-bg.jpg`,
          downloadUrl: `/api/social/generate-card?slug=${slug}&template=square`
        }
      ],
      memoryWall: {
        totalSubmissions: 42,
        communityPhotos: [
          {
            id: "mem-01",
            userName: "Aarav P.",
            caption: "Grand evening Rangoli and Diya setup at home!",
            imageUrl: `/assets/images/community/${slug}-mem1.jpg`,
            likesCount: 128,
            verified: true
          },
          {
            id: "mem-02",
            userName: "Priya S.",
            caption: "Family traditional attire for festive morning rituals.",
            imageUrl: `/assets/images/community/${slug}-mem2.jpg`,
            likesCount: 94,
            verified: true
          }
        ]
      }
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = StorySocialCards;
}
