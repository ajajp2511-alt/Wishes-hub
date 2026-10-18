/**
 * Wishes Hub - Emotion Guard & Content Moderation Module
 * File: modules/emotion-guard-filter.js
 */

export class EmotionGuardFilterModule {
  constructor() {
    this.moduleName = 'emotion-guard-filter';
    // Basic restricted word list for moderation
    this.blockedKeywords = ['abuse', 'hate', 'fraud', 'scam', 'violence', 'suicide'];
  }

  /**
   * Filter and moderate wish messages, card notes, and special instructions
   * @param {String} textMessage 
   * @returns {Object} Moderation result
   */
  moderateWishMessage(textMessage) {
    if (!textMessage || typeof textMessage !== 'string') {
      return {
        safe: true,
        filteredText: ''
      };
    }

    let isSafe = true;
    let cleanedText = textMessage;

    const lowerText = textMessage.toLowerCase();
    for (const word of this.blockedKeywords) {
      if (lowerText.includes(word)) {
        isSafe = false;
        const regex = new RegExp(word, 'gi');
        cleanedText = cleanedText.replace(regex, '***');
      }
    }

    return {
      safe: isSafe,
      originalText: textMessage,
      filteredText: cleanedText,
      message: isSafe ? 'Message passed safety check.' : 'Inappropriate content detected and masked.'
    };
  }
}

export const emotionGuardFilter = new EmotionGuardFilterModule();
