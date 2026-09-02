import { GLOBAL_LANG_CONFIG } from './global-language-config.js';

export class GlobalLanguageCore {
    constructor() {
        this.languages = [
            { code: 'en', name: 'English', nativeName: 'English', status: 'Active', isDefault: true, flag: '🇬🇧', direction: 'ltr' },
            { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', status: 'Active', isDefault: false, flag: '🇮🇳', direction: 'ltr' }
        ];
        this.currentActiveLang = GLOBAL_LANG_CONFIG.DEFAULT_ACTIVE_LANG;
        
        this.translations = {
            'Navbar': {
                'dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
                'categories': { en: 'Categories', hi: 'श्रेणियाँ' }
            },
            'Actions': {
                'submit': { en: 'Submit', hi: 'जमा करें' },
                'delete': { en: 'Delete', hi: 'हटाएं' }
            }
        };
    }

    getLanguages() {
        return this.languages;
    }

    getActiveLanguages() {
        return this.languages.filter(l => l.status === 'Active');
    }

    addLanguage(langData) {
        const exists = this.languages.some(l => l.code === langData.code);
        if (exists) return false;

        this.languages.push({
            code: langData.code,
            name: langData.name,
            nativeName: langData.nativeName,
            status: langData.status || 'Active',
            isDefault: false,
            flag: langData.flag || '🌐',
            direction: langData.direction || 'ltr'
        });
        return true;
    }

    deleteLanguage(code) {
        const langIndex = this.languages.findIndex(l => l.code === code);
        if (langIndex === -1) return false;

        const lang = this.languages[langIndex];
        if (lang.isDefault) {
            alert('Cannot delete the default site language!');
            return false;
        }

        this.languages.splice(langIndex, 1);

        for (const group in this.translations) {
            for (const key in this.translations[group]) {
                if (this.translations[group][key][code]) {
                    delete this.translations[group][key][code];
                }
            }
        }

        if (this.currentActiveLang === code) {
            const defaultLang = this.languages.find(l => l.isDefault);
            this.currentActiveLang = defaultLang ? defaultLang.code : 'en';
        }

        return true;
    }

    toggleLanguageStatus(code) {
        const lang = this.languages.find(l => l.code === code);
        if (lang) {
            if (lang.isDefault && lang.status === 'Active') {
                alert('Default site language cannot be deactivated!');
                return false;
            }
            lang.status = lang.status === 'Active' ? 'Inactive' : 'Active';
            return true;
        }
        return false;
    }

    setDefaultLanguage(code) {
        const lang = this.languages.find(l => l.code === code);
        if (lang) {
            lang.status = 'Active';
            this.languages.forEach(l => {
                l.isDefault = (l.code === code);
            });
            this.currentActiveLang = code;
        }
    }

    updateTranslation(group, key, langCode, value) {
        if (!this.translations[group]) this.translations[group] = {};
        if (!this.translations[group][key]) this.translations[group][key] = {};
        this.translations[group][key][langCode] = value;
    }

    getTranslation(group, key, langCode = this.currentActiveLang) {
        return this.translations[group]?.[key]?.[langCode] || this.translations[group]?.[key]?.[GLOBAL_LANG_CONFIG.FALLBACK_LANG] || key;
    }

    switchActiveLanguage(langCode) {
        const lang = this.languages.find(l => l.code === langCode);
        if (lang && lang.status === 'Active') {
            this.currentActiveLang = langCode;
            return true;
        }
        return false;
    }

    getTranslationProgress(langCode) {
        let totalKeys = 0;
        let translatedKeys = 0;

        for (const group in this.translations) {
            for (const key in this.translations[group]) {
                totalKeys++;
                if (this.translations[group][key][langCode] && this.translations[group][key][langCode].trim() !== '') {
                    translatedKeys++;
                }
            }
        }
        if (totalKeys === 0) return 100;
        return Math.round((translatedKeys / totalKeys) * 100);
    }

    exportTranslationsJSON() {
        return JSON.stringify(this.translations, null, 2);
    }

    importTranslationsJSON(jsonData) {
        try {
            const parsed = JSON.parse(jsonData);
            if (typeof parsed === 'object' && parsed !== null) {
                this.translations = parsed;
                return true;
            }
        } catch (e) {
            console.error('Invalid JSON format', e);
        }
        return false;
    }
    }
