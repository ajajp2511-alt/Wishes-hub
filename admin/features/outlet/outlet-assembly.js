import { OutletCore } from './outlet-core.js';
import { OUTLET_CONFIG } from './outlet-config.js';

export class OutletAssembly {
  /**
   * FeaturesAssembly dwaara safeRun() ke zariye call hone waala init function
   */
  static async initOutlet() {
    console.log("🔌 [Outlet Assembly] Initializing dynamic view manager...");
    
    // Inject core CSS style dynamically if needed
    this.injectStyles();
    
    // Initial view load (e.g., analytics or dashboard)
    await OutletCore.renderFeatureView(OUTLET_CONFIG.DEFAULT_FEATURE);
  }

  static injectStyles() {
    const cssId = 'outlet-styles';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = '/admin/features/outlet/assets/style-css.css';
      document.head.appendChild(link);
    }
  }

  static navigateTo(featureName) {
    OutletCore.renderFeatureView(featureName);
  }
}

// Named export for safeRun compatibility
export const initOutlet = () => OutletAssembly.initOutlet();
