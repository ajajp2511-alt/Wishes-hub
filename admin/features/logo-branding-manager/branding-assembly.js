import { BrandingCore } from './branding-core.js';
import { BrandingUI } from './branding-ui.js';
import { handleVisibilityToggle } from './modules/placement-visibility-toggles.js';

const core = new BrandingCore();
const ui = new BrandingUI(core);

window.togglePlacementVisibility = (id) => {
    handleVisibilityToggle(core, ui, id);
};

export function init(containerId, moduleName) {
    ui.init();
}
