export class SandboxUI {
    constructor(core) {
        this.core = core;
    }

    init() {
        this.render();
    }

    render() {
        this.renderToggleMatrix();
        this.renderAuditLogs();
        this.renderSandboxNotes();
        this.renderAIAnalysisBox();
    }

    renderToggleMatrix() {
        const container = document.getElementById('featureToggleContainer');
        if (!container) return;

        container.innerHTML = '';
        const flags = this.core.getFeatureFlags();

        flags.forEach(flag => {
            let badge = flag.status ? 'flag-badge-active' : 'flag-badge-inactive';
            let label = flag.status ? 'ENABLED (LIVE/TEST)' : 'DISABLED (OFF)';

            container.innerHTML += `
                <div class="bg-white border rounded-lg p-3.5 mb-3 shadow-xs flex justify-between items-center">
                    <div>
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="font-bold text-sm text-gray-800">${flag.name}</span>
                            <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold ${badge}">${label}</span>
                        </div>
                        <p class="text-xs text-gray-500">Category: <span class="text-indigo-600 font-medium">${flag.category}</span> • Rollout: <strong>${flag.rollout}%</strong> • Target: ${flag.roleTarget}</p>
                    </div>
                    <div>
                        <button onclick="window.toggleSandboxFlag('${flag.id}')" class="text-xs bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800 transition font-semibold">Toggle State</button>
                    </div>
                </div>
            `;
        });
    }

    renderAuditLogs() {
        const container = document.getElementById('sandboxAuditContainer');
        if (!container) return;

        container.innerHTML = '';
        this.core.auditLogs.forEach(log => {
            container.innerHTML += `
                <div class="bg-slate-50 border rounded p-2 text-xs mb-2 flex justify-between items-center">
                    <div>
                        <span class="font-bold text-gray-700">${log.action}</span>
                        <p class="text-gray-400 text-[10px]">${log.timestamp} • By: ${log.admin}</p>
                    </div>
                    <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">${log.status}</span>
                </div>
            `;
        });
    }

    renderSandboxNotes() {
        const container = document.getElementById('sandboxNotesContainer');
        if (!container) return;

        container.innerHTML = '';
        this.core.sandboxNotes.forEach(note => {
            container.innerHTML += `
                <div class="bg-amber-50 border border-amber-200 rounded p-2.5 text-xs mb-2">
                    <div class="flex justify-between font-bold text-amber-900 text-[10px] mb-1">
                        <span>${note.author}</span>
                        <span>${note.timestamp}</span>
                    </div>
                    <p class="text-amber-950">${note.text}</p>
                </div>
            `;
        });
    }

    renderAIAnalysisBox() {
        const container = document.getElementById('aiAnalysisContainer');
        if (!container) return;

        const report = this.core.runAIRiskAssessment();
        container.innerHTML = `
            <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3.5 text-xs">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-indigo-900 uppercase">AI Risk & Conflict Analyzer</span>
                    <span class="bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-bold">Safety Score: ${report.safetyScore}%</span>
                </div>
                <p class="text-indigo-800 mt-1">${report.summary}</p>
            </div>
        `;
    }
}
