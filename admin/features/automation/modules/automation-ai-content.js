/**
 * AI Wishes & Multi-Language Content Generator
 * Path: admin/features/automation/modules/automation-ai-content.js
 * Description: Generates dynamic festival wishes, quotes, shayri, and greetings 
 *              across multiple categories and languages.
 */

import { automationCore } from '../automation-core.js';

export class AutomationAIContentEngine {
  constructor() {
    this.core = automationCore;

    // Built-in Greeting Template Vault
    this.contentVault = {
      fest_diwali: {
        hi: [
          'दीपावली के इस पावन अवसर पर आपके जीवन में सुख, समृद्धि और खुशियों का उजाला फैले। शुभ दीपावली!',
          'दीयों की रोशनी से जगमगाता रहे आपका घर-आंगन, माता लक्ष्मी का बना रहे आशीर्वाद हर क्षण। दीपावली की हार्दिक शुभकामनाएं!'
        ],
        en: [
          'May the festival of lights illuminate your life with joy, health, and prosperity. Happy Diwali!',
          'Wishing you and your family a sparkling Diwali filled with love, laughter, and success.'
        ],
        mr: [
          'दिवाळीच्या या मंगलमयी पर्वावर तुमच्या जीवनात सुख, समृद्धी आणि समाधान लाभावे. शुभ दिवाळी!'
        ]
      },
      fest_newyear: {
        en: [
          'May the New Year bring you new opportunities, fresh perspectives, and endless joy! Happy New Year!',
          'Cheers to a bright new year and a fond farewell to the old. Wishing you love and happiness!'
        ],
        hi: [
          'नया साल आपके जीवन में नई उमंग, खुशियां और सफलता लेकर आए। नया साल मुबारक!'
        ]
      },
      default: {
        en: [
          'Sending you warm wishes, happiness, and success on this special occasion!',
          'May this day bring endless smile, warmth, and joyful moments to you and your loved ones.'
        ],
        hi: [
          'इस खास अवसर पर आपको और आपके परिवार को ढेर सारी खुशियां और शुभकामनाएं!'
        ]
      }
    };
  }

  /**
   * Generate Wish Content based on Festival ID, Language & Category
   */
  generateWish({ festivalId, lang = 'hi', category = 'Festive', customTopic = '' }) {
    const festivalContent = this.contentVault[festivalId] || this.contentVault['default'];
    const languageContent = festivalContent[lang] || festivalContent['en'] || this.contentVault['default']['en'];

    // Pick random base wish template
    const randomIndex = Math.floor(Math.random() * languageContent.length);
    let selectedText = languageContent[randomIndex];

    if (customTopic) {
      selectedText += ` (${customTopic})`;
    }

    const generatedResult = {
      festivalId,
      lang,
      category,
      text: selectedText,
      generatedAt: new Date().toISOString()
    };

    this.core.log('AI_CONTENT', `Generated ${lang.toUpperCase()} wish for ${festivalId}`, 'INFO');
    return generatedResult;
  }

  /**
   * Add custom quote/shayri to vault dynamically
   */
  addTemplate(festivalId, lang, wishText) {
    if (!this.contentVault[festivalId]) {
      this.contentVault[festivalId] = {};
    }
    if (!this.contentVault[festivalId][lang]) {
      this.contentVault[festivalId][lang] = [];
    }

    this.contentVault[festivalId][lang].push(wishText);
    this.core.log('AI_CONTENT', `Added custom template for ${festivalId} [${lang}]`, 'SUCCESS');
    return true;
  }
}

export const automationAIContent = new AutomationAIContentEngine();
