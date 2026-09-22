/**
 * Geo Fencing Assembly Controller (Complete UI Mapping)
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

    // GeoUI ke saare required elements ko map karne wala HTML shell
    container.innerHTML = `
      <div class="p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Geo-Fencing & Cyber Fortress</h1>
          <p class="text-sm text-gray-500">Manage global security configurations, whitelists, and live system audits.</p>
        </div>

        <!-- 1. Kill Switch Status Container -->
        <div id="killSwitchContainer"></div>

        <!-- 2. AI Predictive Shield Container -->
        <div id="aiPredictiveContainer"></div>

        <!-- 3. Country Whitelist / Management Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Country Whitelists & Regional Gateways</h3>
          <div id="geoCountryContainer"></div>
        </div>

        <!-- 4. Geo Logs Container -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Real-time Security Logs</h3>
          <div id="geoLogsContainer"></div>
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
        ui.init();
    } else {
        ui.render();
    }
  }
};

export default GeoAssembly;
