import { GeoCore } from './geo-core.js';
import { GeoUI } from './geo-ui.js';
import { handleToggleCountry } from './modules/country-whitelist.js';
import { triggerGlobalPanicKillSwitch } from './modules/emergency-killswitch.js';

const core = new GeoCore();
const ui = new GeoUI(core);

window.toggleGeoCountry = (code) => {
    handleToggleCountry(core, ui, code);
};

window.togglePanicKillSwitch = () => {
    const isLocked = triggerGlobalPanicKillSwitch(core);
    ui.render();
    if (isLocked) {
        alert('⚠️ EMERGENCY GLOBAL KILL-SWITCH ACTIVATED! All international traffic is now blocked.');
    } else {
        alert('✅ Global Kill-Switch deactivated. Normal geofencing rules restored.');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ui.init();
});
