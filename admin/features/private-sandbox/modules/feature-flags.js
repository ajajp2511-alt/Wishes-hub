export function handleToggleFlag(core, ui, flagId) {
    const success = core.toggleFlag(flagId);
    if (success) {
        ui.render();
    }
}
