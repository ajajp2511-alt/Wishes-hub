import { OmniCore } from './omni-core.js';
import { OmniUI } from './omni-ui.js';

const core = new OmniCore();
const ui = new OmniUI(core);

window.triggerCloudBuild = (targetId) => {
    const success = core.triggerCloudBuild(targetId);
    if (success) {
        ui.render();
        alert('☁️ Cloud Build Pipeline triggered successfully! Your package will be ready for download shortly.');
    }
};

// ✅ Add this export init function for the Universal Smart Router
export function init(containerId) {
    const root = document.getElementById(containerId);
    if (root) {
        ui.init();
    }
}

// Fallback for direct page load
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('dynamic-content-root')) {
        ui.init();
    }
});
