export function handleSetDefaultLanguage(core, ui, code) {
    core.setDefaultLanguage(code);
    ui.render();
}
