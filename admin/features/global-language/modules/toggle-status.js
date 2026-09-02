export function handleToggleLanguageStatus(core, ui, code) {
    const success = core.toggleLanguageStatus(code);
    if (success) {
        ui.render();
    }
}
