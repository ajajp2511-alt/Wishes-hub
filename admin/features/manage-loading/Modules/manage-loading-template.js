/**
 * modules/manage-loading-template.js
 * Localization message templates and formatting helpers
 */
import { LoadingConfig } from '../manage-loading-config.js';

export const LoadingTemplate = {
  getMessage(key, lang = 'en') {
    return LoadingConfig.messages[lang]?.[key] || LoadingConfig.messages.en.default;
  }
};
