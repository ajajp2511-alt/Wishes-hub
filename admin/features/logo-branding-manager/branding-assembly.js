import { BrandingCore } from './branding-core.js';
import { BrandingUI } from './branding-ui.js';
import { handleVisibilityToggle } from './modules/placement-visibility-toggles.js';

const core = new BrandingCore();
const ui = new BrandingUI(core);

window.togglePlacementVisibility = (id) => {
    handleVisibilityToggle(core, ui, id);
};

export function init(containerId, moduleName) {
    const container = document.getElementById(containerId);
    if (container) {
        // Agar BrandingUI containerId ko use karta hai ya direct init() call hota hai
        ui.init();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Agar direct page load ho toh
    if (!document.getElementById('dynamic-content-root')?.innerHTML.trim()) {
        ui.init();
    }
});
