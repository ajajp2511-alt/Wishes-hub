import { OutletCore } from './outlet-core.js';
import { OUTLET_CONFIG } from './outlet-config.js';

export class OutletAssembly {
    static async initOutlet() {
        console.log("🔌 [Outlet Assembly] Initializing dynamic view manager...");
        
        // Inject core CSS style dynamically
        this.injectStyles();

        // Analytics auto-load remove kar diya hai
        if (OUTLET_CONFIG.DEFAULT_FEATURE) {
            await OutletCore.renderFeatureView(OUTLET_CONFIG.DEFAULT_FEATURE);
        }
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

export const initOutlet = () => OutletAssembly.initOutlet();
