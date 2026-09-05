export function saveNote(core, ui, text) {
    if (!text.trim()) return;
    core.addSandboxNote(text);
    ui.render();
}
