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

export function init(containerId) {
    const root = document.getElementById(containerId);
    if (root) {
        root.innerHTML = `
            <div class="p-4 max-w-4xl mx-auto">
                <div class="mb-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-1">Platform Builds & Exporter</h2>
                    <p class="text-xs text-gray-500">Manage cross-platform deployments and automated store compliance.</p>
                </div>
                <div id="aiComplianceContainer" class="mb-4"></div>
                <div id="omniTargetsContainer" class="mb-4"></div>
                <div id="omniLogsContainer"></div>
            </div>
        `;
        ui.init();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultRoot = document.getElementById('dynamic-content-root');
    if (defaultRoot && !defaultRoot.hasChildNodes()) {
        init('dynamic-content-root');
    }
});
