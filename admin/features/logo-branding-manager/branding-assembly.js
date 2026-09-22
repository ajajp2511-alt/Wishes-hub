import { BrandingCore } from './branding-core.js';
import { BrandingUI } from './branding-ui.js';
import { handleVisibilityToggle } from './modules/placement-visibility-toggles.js';

const core = new BrandingCore();
const ui = new BrandingUI(core);

window.togglePlacementVisibility = (id) => {
    handleVisibilityToggle(core, ui, id);
};

export function init(containerElement) {
    try {
        let container = containerElement;
        if (typeof containerElement === 'string') {
            const targetId = containerElement.startsWith('#') ? containerElement.substring(1) : containerElement;
            container = document.getElementById(targetId) || document.querySelector(containerElement);
        }
        
        if (container && typeof ui.init === 'function') {
            ui.init(container);
        } else if (typeof ui.init === 'function') {
            ui.init();
        } else {
            console.error('BrandingAssembly: ui.init is not a function');
        }
    } catch (err) {
        console.error('Error initializing BrandingAssembly:', err);
    }
}
