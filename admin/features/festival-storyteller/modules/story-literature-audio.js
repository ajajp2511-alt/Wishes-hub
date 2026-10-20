/**
 * story-literature-audio.js
 * Folk Songs, Poetry, Aartis & Audio Storytelling Narration Engine
 * Location: wishes-hub/admin/features/festival-storyteller/modules/story-literature-audio.js
 */

class StoryLiteratureAudio {
  constructor() {
    this.name = "StoryLiteratureAudio";
  }

  /**
   * Process literature, poetry, devotional chants, and audio narration links
   * @param {Object} rawData - Raw festival dataset
   * @param {string} lang - Selected language code
   * @returns {Object} Structured literature and audio payload
   */
  processLiterature(rawData, lang = "hi") {
    if (!rawData) return {};

    const title = rawData.title || "Festival";

    return {
      poetryAndDevotional: [
        {
          title: `${title} Traditional Vandana & Chants`,
          type: "Aarti / Stotra",
          lyrics: "Mangalam Bhagwan Vishnu, Mangalam Garunadhwaja. Mangalam Pundari Kaksha, Mangalay Tano Harih.",
          meaning: "Universal invocation seeking blessings, prosperity, and spiritual harmony during celebrations."
        },
        {
          title: `Traditional Festive Folk Verse`,
          type: "Folk Song",
          lyrics: "Shubh Parv Aaya Re, Khushiyan Hazaar Laya Re...",
          meaning: "Celebratory folk lyrics welcoming the festive season with joy and togetherness."
        }
      ],
      audioNarration: {
        trackTitle: `${title} Full Katha & Origin Story Narration`,
        duration: "4:30 mins",
        audioUrl: `/assets/audio/festivals/${rawData.slug || "default"}-katha.mp3`,
        language: lang,
        narrator: "Wishes Hub Cultural Studio",
        transcriptSummary: "Listen to the complete historical and devotional story with rich ambient music and traditional narration."
      }
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = StoryLiteratureAudio;
}
