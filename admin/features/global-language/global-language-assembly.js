import { GlobalLanguageCore } from './global-language-core.js';
import { GlobalLanguageUI } from './global-language-ui.js';
import { handleAddLanguage } from './modules/add-language.js';
import { handleDeleteLanguage } from './modules/delete-language.js';
import { handleToggleLanguageStatus } from './modules/toggle-status.js';
import { handleSetDefaultLanguage } from './modules/default-language.js';
import { handleUpdateTranslation } from './modules/update-translation.js';
import { handleExportJSON, handleImportJSON } from './modules/export-import.js';
import { handleSwitchLanguage } from './modules/switch-language.js';

const core = new GlobalLanguageCore();

// Saare handlers ko ek hi object mein define karein taaki UI ko turant mil sakein
const handlers = {
    onAdd: (e) => handleAddLanguage(core, uiInstance, e),
    onDelete: (code) => handleDeleteLanguage(core, uiInstance, code),
    onToggleStatus: (code) => handleToggleLanguageStatus(core, uiInstance, code),
    setDefault: (code) => handleSetDefaultLanguage(core, uiInstance, code),
    updateTrans: (group, key, langCode, value) => handleUpdateTranslation(core, uiInstance, group, key, langCode, value),
    exportJSON: () => handleExportJSON(core),
    importJSON: (e) => handleImportJSON(core, uiInstance, e),
    switchLang: (code) => handleSwitchLanguage(core, uiInstance, code)
};

// UI instance banate waqt handlers pass karein
const uiInstance = new GlobalLanguageUI(core, handlers);

// Global window functions assign karein (agar HTML inline onclicks ke liye zaroori ho)
window.openLanguageModal = () => uiInstance.openModal();
window.closeLanguageModal = () => uiInstance.closeModal();
window.setDefaultLang = (code) => handleSetDefaultLanguage(core, uiInstance, code);
window.toggleLangStatus = (code) => handleToggleLanguageStatus(core, uiInstance, code);
window.deleteLang = (code) => handleDeleteLanguage(core, uiInstance, code);
window.updateTrans = (group, key, langCode, value) => handleUpdateTranslation(core, uiInstance, group, key, langCode, value);
window.exportTranslations = () => handleExportJSON(core);
window.triggerImportTranslations = (e) => handleImportJSON(core, uiInstance, e);
window.switchLang = (code) => handleSwitchLanguage(core, uiInstance, code);

export function init(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        uiInstance.init(container);
    } else {
        console.error(`Container with ID "${containerId}" not found.`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('dynamic-content-root');
    if (rootElement) {
        uiInstance.init(rootElement);
    }
});
