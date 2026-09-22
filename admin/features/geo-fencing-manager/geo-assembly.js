/**
 * Geo Fencing Assembly Controller (With HTML Shell Rendering)
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

    // Container ke andar required HTML shell inject karein
    container.innerHTML = `
      <div class="p-6 max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Geo-Fencing & Localization</h1>
            <p class="text-sm text-gray-500">Manage country whitelists and emergency kill-switches.</p>
          </div>
          <button onclick="window.togglePanicKillSwitch()" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition">
            <i class="fa-solid fa-triangle-exclamation mr-2"></i> Global Kill-Switch
          </button>
        </div>

        <div id="geoContentContainer" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <!-- Geo UI will render its content here -->
        </div>
      </div>
    `;

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

    if (typeof ui.init === 'function') {
        ui.init(rootId);
    } else {
        ui.render();
    }
  }
};

export default GeoAssembly;
