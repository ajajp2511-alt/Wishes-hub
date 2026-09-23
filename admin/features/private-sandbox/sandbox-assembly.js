import { SandboxCore } from './sandbox-core.js';
import { SandboxUI } from './sandbox-ui.js';
import { handleToggleFlag } from './modules/feature-flags.js';
import { saveNote } from './modules/sandbox-notes.js';
import { performInstantRollback } from './modules/instant-rollback.js';

export function init(containerId, name) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Optional: Agar aapko module ka header ya container setup karna ho
    // container.innerHTML = `<div id="sandbox-root"></div>`;

    const core = new SandboxCore();
    const ui = new SandboxUI(core);

    window.toggleSandboxFlag = (id) => {
        handleToggleFlag(core, ui, id);
    };

    window.saveSandboxNote = () => {
        const input = document.getElementById('sandboxNoteInput');
        if (input) {
            saveNote(core, ui, input.value);
            input.value = '';
        }
    };

    window.triggerGlobalRollback = () => {
        if (confirm('Are you sure you want to trigger emergency rollback across modules?')) {
            performInstantRollback(core);
            ui.render();
            alert('Emergency Rollback Executed Successfully!');
        }
    };

    // Dynamically imported modules execute immediately, so initialize UI right here:
    ui.init();
}
