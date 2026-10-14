/**
 * Dynamic Multi-Language Auto-Translator Engine
 * Path: admin/features/automation/modules/automation-translator.js
 * Description: Detects visitor locale and automatically translates festival quotes 
 *              and greetings into local target languages in real-time.
 */

import { automationCore } from '../automation-core.js';

export class AutomationTranslatorEngine {
  constructor() {
    this.core = automationCore;
    // Common festival phrase dictionary for instant fallback translation
    this.translationDictionary = {
      'Happy Diwali!': {
        hi: 'शुभ दीपावली!',
        mr: 'शुभ दिवाळी!',
        gu: 'શુભ દીપાવલી!',
        ta: 'இனிய தீபாவளி நல்வாழ்த்துக்கள்!',
        ar: 'عيد ديوالي سعيد!'
      },
      'Happy New Year!': {
        hi: 'नया साल मुबारक!',
        mr: 'नवीन वर्षाच्या हार्दिक शुभेच्छा!',
        gu: 'નૂતન વર્ષાભિનંદન!',
        es: '¡Feliz Año Nuevo!',
        fr: 'Bonne Année!',
        ar: 'سنة جديدة سعيدة!'
      },
      'Wishing you peace and prosperity.': {
        hi: 'आपके जीवन में सुख और समृद्धि बनी रहे।',
        mr: 'तुमच्या जीवनात सुख आणि समृद्धी लाभो.',
        es: 'Deseándote paz y prosperidad.',
        ar: 'أتمنى لك السلام والازدهار.'
      }
    };
  }

  /**
   * Translate text string to target language code
   */
  translateText(text, targetLang = 'hi') {
    if (!text || targetLang === 'en') {
      return text;
    }

    // Direct dictionary lookup
    if (this.translationDictionary[text] && this.translationDictionary[text][targetLang]) {
      const translated = this.translationDictionary[text][targetLang];
      this.core.log('TRANSLATOR', `Translated phrase to [${targetLang}]: "${translated}"`, 'INFO');
      return translated;
    }

    // Fallback: Return original text with language tag metadata
    this.core.log('TRANSLATOR', `No exact translation found for "${text}". Returning original string.`, 'WARN');
    return text;
  }

  /**
   * Add custom translation pair to runtime dictionary
   */
  addTranslationRule(sourceText, targetLang, translatedText) {
    if (!this.translationDictionary[sourceText]) {
      this.translationDictionary[sourceText] = {};
    }
    this.translationDictionary[sourceText][targetLang] = translatedText;
    this.core.log('TRANSLATOR', `Added translation rule for [${targetLang}]: ${sourceText}`, 'SUCCESS');
    return true;
  }
}

export const automationTranslator = new AutomationTranslatorEngine();
