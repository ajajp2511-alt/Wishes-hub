import { GlobalLanguageCore } from './global-language-core.js';
import { GlobalLanguageUI } from './global-language-ui.js';
import { handleAddLanguage } from './modules/add-language.js';
import { handleDeleteLanguage } from './modules/delete-language.js';
import { handleToggleLanguageStatus } from './modules/toggle-status.js';
import { handleSetDefaultLanguage } from './modules/default-language.js';
import { handleUpdateTranslation } from './modules/update-translation.js';
import { handleExportJSON, handleImportJSON } from './modules/export-import.js';
import { handleSwitchLanguage } from './modules/switch-language.js';

let core = null;
let uiInstance = null;

try {
    core = new GlobalLanguageCore();
    
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

    uiInstance = new GlobalLanguageUI(core, handlers);

    // Global window functions assign karein
    window.openLanguageModal = () => uiInstance?.openModal();
    window.closeLanguageModal = () => uiInstance?.closeModal();
    window.setDefaultLang = (code) => handleSetDefaultLanguage(core, uiInstance, code);
    window.toggleLangStatus = (code) => handleToggleLanguageStatus(core, uiInstance, code);
    window.deleteLang = (code) => handleDeleteLanguage(core, uiInstance, code);
    window.updateTrans = (group, key, langCode, value) => handleUpdateTranslation(core, uiInstance, group, key, langCode, value);
    window.exportTranslations = () => handleExportJSON(core);
    window.triggerImportTranslations = (e) => handleImportJSON(core, uiInstance, e);
    window.switchLang = (code) => handleSwitchLanguage(core, uiInstance, code);

} catch (err) {
    console.error("❌ Error initializing Global Language module instances:", err);
}

export function init(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        if (uiInstance && typeof uiInstance.init === 'function') {
            uiInstance.init(container);
        } else {
            container.innerHTML = `<div style="padding: 20px; color: #d9534f;"><h3>Error</h3><p>Language UI instance failed to initialize properly.</p></div>`;
        }
    } else {
        console.error(`Container with ID "${containerId}" not found.`);
    }
}
