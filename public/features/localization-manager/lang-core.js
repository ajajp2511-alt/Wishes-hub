// Wishes-hub: Localization Core
import { LangConfig } from './lang-config.js';

const LocalizationCore = {
    currentLang: localStorage.getItem('wishes-hub-lang') || LangConfig.defaultLang,

    async getStrings() {
        const response = await fetch(`./features/localization-manager/assets/${this.currentLang}.json`);
        return await response.json();
    },

    async applyTranslations() {
        const strings = await this.getStrings();
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (strings[key]) el.innerText = strings[key];
        });
    },

    setLanguage(lang) {
        if (LangConfig.supportedLanguages.includes(lang)) {
            localStorage.setItem('wishes-hub-lang', lang);
            location.reload();
        }
    }
};

export default LocalizationCore;
