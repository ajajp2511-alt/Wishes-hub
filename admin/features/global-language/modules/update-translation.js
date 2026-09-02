export function handleUpdateTranslation(core, ui, group, key, langCode, value) {
    core.updateTranslation(group, key, langCode, value);
    ui.updateProgressBar(langCode);
}
