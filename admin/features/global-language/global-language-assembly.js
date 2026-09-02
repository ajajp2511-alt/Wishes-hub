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

const handlers = {
    onAdd: (e) => handleAddLanguage(core, ui, e)
};

const ui = new GlobalLanguageUI(core, handlers);

window.openLanguageModal = () => ui.openModal();
window.closeLanguageModal = () => ui.closeModal();
window.setDefaultLang = (code) => handleSetDefaultLanguage(core, ui, code);
window.toggleLangStatus = (code) => handleToggleLanguageStatus(core, ui, code);
window.deleteLang = (code) => handleDeleteLanguage(core, ui, code);
window.updateTrans = (group, key, langCode, value) => handleUpdateTranslation(core, ui, group, key, langCode, value);
window.exportTranslations = () => handleExportJSON(core);
window.triggerImportTranslations = (e) => handleImportJSON(core, ui, e);
window.switchLang = (code) => handleSwitchLanguage(core, ui, code);

document.addEventListener('DOMContentLoaded', () => {
    ui.init();
});
