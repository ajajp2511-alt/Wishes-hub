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

// Pehle 'ui' ka instance banayein (handlers ko null ya empty rakh kar)
const ui = new GlobalLanguageUI(core, {});

// Phir handlers define karein jisme 'ui' safely use ho sake
const handlers = {
    onAdd: (e) => handleAddLanguage(core, ui, e)
};

// Agar GlobalLanguageUI me baad me handlers set karne ka method hai toh use karein, 
// ya fir upar wale order ko theek karein:

window.openLanguageModal = () => ui.openModal();
window.closeLanguageModal = () => ui.closeModal();
window.setDefaultLang = (code) => handleSetDefaultLanguage(core, ui, code);
window.toggleLangStatus = (code) => handleToggleLanguageStatus(core, ui, code);
window.deleteLang = (code) => handleDeleteLanguage(core, ui, code);
window.updateTrans = (group, key, langCode, value) => handleUpdateTranslation(core, ui, group, key, langCode, value);
window.exportTranslations = () => handleExportJSON(core);
window.triggerImportTranslations = (e) => handleImportJSON(core, ui, e);
window.switchLang = (code) => handleSwitchLanguage(core, ui, code);

export function init(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        ui.init();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('dynamic-content-root')) {
        ui.init();
    }
});
