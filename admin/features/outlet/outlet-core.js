import { OUTLET_CONFIG } from './outlet-config.js';

export class OutletCore {
  static async renderFeatureView(featureName) {
    const container = document.getElementById(OUTLET_CONFIG.ROOT_CONTAINER_ID);
    if (!container) return;

    // Loading Indicator
    container.innerHTML = `<div class="outlet-loading">Loading ${featureName}...</div>`;

    try {
      // Dynamic import following your exact project pattern
      const viewModule = await import(`${OUTLET_CONFIG.BASE_PATH}/${featureName}/${featureName}-view.js`);
      
      if (viewModule && typeof viewModule.render === 'function') {
        container.innerHTML = '';
        viewModule.render(container);
      } else {
        container.innerHTML = `<div class="outlet-error">View render function missing for: ${featureName}</div>`;
      }
    } catch (error) {
      console.error(`[Outlet Core Error] Failed to load feature module: ${featureName}`, error);
      container.innerHTML = `<div class="outlet-error">Failed to load feature module: ${featureName}</div>`;
    }
  }
        }
