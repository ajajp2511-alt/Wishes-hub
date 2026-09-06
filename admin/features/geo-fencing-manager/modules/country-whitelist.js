export function handleToggleCountry(core, ui, countryCode) {
    const success = core.toggleCountryStatus(countryCode);
    if (success) {
        ui.render();
    }
}
