/**
 * Geo Fencing Assembly Controller (Fixed for Dynamic Router)
 * Path: admin/features/geo-fencing-manager/geo-assembly.js
 */

import { GeoCore } from './geo-core.js';
import { GeoUI } from './geo-ui.js';
import { handleToggleCountry } from './modules/country-whitelist.js';
import { triggerGlobalPanicKillSwitch } from './modules/emergency-killswitch.js';

export const GeoAssembly = {
  init(rootId) {
    const container = document.getElementById(rootId);
    if (!container) {
      console.error(`Root container with ID "${rootId}" not found.`);
      return;
    }

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

    // Initialize UI directly without waiting for DOMContentLoaded
    if (typeof ui.init === 'function') {
        ui.init(rootId);
    } else {
        ui.render();
    }
  }
};

export default GeoAssembly;
