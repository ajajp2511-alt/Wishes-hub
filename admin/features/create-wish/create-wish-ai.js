/**
 * Create Wish Feature - AI Content & Translation Engine
 * Path: admin/features/create-wish/create-wish-ai.js
 */

export class CreateWishAI {
  constructor() {
    this.apiEndpoint = '/api/ai-generator';
  }

  /**
   * Generate Wish Content based on Occasion and Tone
   */
  async generateContent(occasion, tone = 'Emotional', targetLang = 'hi') {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_wish',
          occasion,
          tone,
          targetLang
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'AI Generation failed');

      return {
        success: true,
        generatedTitle: data.title,
        generatedContent: data.content,
        suggestedTags: data.tags || []
      };
    } catch (error) {
      console.error('[CreateWishAI] Content Generation Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Auto-Translate text into target language
   */
  async translateText(text, targetLang) {
    if (!text || text.trim() === '') return { success: false, message: 'Text is empty' };

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          text,
          targetLang
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Translation failed');

      return {
        success: true,
        translatedText: data.translatedText,
        language: targetLang
      };
    } catch (error) {
      console.error('[CreateWishAI] Translation Error:', error);
      return { success: false, message: error.message };
    }
  }
}

export const createWishAIInstance = new CreateWishAI();
