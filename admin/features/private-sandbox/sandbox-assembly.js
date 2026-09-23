import { SandboxCore } from './sandbox-core.js';
import { SandboxUI } from './sandbox-ui.js';
import { handleToggleFlag } from './modules/feature-flags.js';
import { saveNote } from './modules/sandbox-notes.js';
import { performInstantRollback } from './modules/instant-rollback.js';

export function init(containerId, name) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // SandboxUI ke saare required containers yahan inject karein
    container.innerHTML = `
        <div class="p-4 max-w-4xl mx-auto space-y-6 font-sans">
            <div class="flex justify-between items-center border-b pb-3">
                <h2 class="text-xl font-bold text-slate-800">🧪 ${name}</h2>
                <button onclick="triggerGlobalRollback()" class="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded font-semibold transition">Emergency Rollback</button>
            </div>

            <!-- AI Risk Analysis Box -->
            <div id="aiAnalysisContainer"></div>

            <!-- Feature Toggles Matrix -->
            <div>
                <h3 class="text-sm font-bold text-slate-700 mb-2">Feature Toggle Matrix</h3>
                <div id="featureToggleContainer"></div>
            </div>

            <!-- Sandbox Notes Section -->
            <div class="bg-white border rounded-lg p-4 shadow-xs">
                <h3 class="text-sm font-bold text-slate-700 mb-2">Sandbox Notes</h3>
                <div id="sandboxNotesContainer"></div>
                <div class="flex gap-2 mt-3">
                    <input type="text" id="sandboxNoteInput" placeholder="Add testing note..." class="border rounded px-3 py-1.5 text-xs flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <button onclick="window.saveSandboxNote()" class="bg-indigo-600 text-white text-xs px-4 py-1.5 rounded font-semibold hover:bg-indigo-700 transition">Save Note</button>
                </div>
            </div>

            <!-- Audit Logs -->
            <div class="bg-white border rounded-lg p-4 shadow-xs">
                <h3 class="text-sm font-bold text-slate-700 mb-2">Audit Logs</h3>
                <div id="sandboxAuditContainer"></div>
            </div>
        </div>
    `;

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

    try {
        ui.init();
    } catch (err) {
        console.error("Sandbox UI Init Error:", err);
    }
}
