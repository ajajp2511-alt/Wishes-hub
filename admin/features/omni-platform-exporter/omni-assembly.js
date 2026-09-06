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

document.addEventListener('DOMContentLoaded', () => {
    ui.init();
});
