export function handleVisibilityToggle(core, ui, placementId) {
    const success = core.togglePlacement(placementId);
    if (success) {
        ui.render();
    }
}
