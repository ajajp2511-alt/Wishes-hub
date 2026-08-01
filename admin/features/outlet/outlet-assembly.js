import { OUTLET_CONFIG } from './outlet-config.js';
import { OutletCore } from './outlet-core.js';

export class OutletAssembly {
  static init() {
    // Default initial feature load
    OutletCore.renderFeatureView(OUTLET_CONFIG.DEFAULT_FEATURE);
  }

  static navigateTo(featureName) {
    OutletCore.renderFeatureView(featureName);
  }
}

// Automatic Initialization
document.addEventListener('DOMContentLoaded', () => {
  OutletAssembly.init();
});
