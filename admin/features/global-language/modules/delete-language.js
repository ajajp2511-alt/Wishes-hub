export function handleDeleteLanguage(core, ui, code) {
    const lang = core.getLanguages().find(l => l.code === code);
    if (!lang) return;

    if (lang.isDefault) {
        alert('Cannot delete the default site language!');
        return;
    }

    if (confirm(`Are you sure you want to delete the language "${lang.name}" (${lang.code})?`)) {
        const success = core.deleteLanguage(code);
        if (success) {
            ui.render();
        } else {
            alert('Failed to delete language.');
        }
    }
}
