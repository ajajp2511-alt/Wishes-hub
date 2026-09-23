export class OmniUI {
    constructor(core) {
        this.core = core;
    }

    init() {
        this.render();
    }

    render() {
        this.renderAiComplianceBox();
        this.renderTargetsTable();
        this.renderBuildLogs();
    }

    renderAiComplianceBox() {
        const container = document.getElementById('aiComplianceContainer');
        if (!container) return;

        const report = this.core.runAiComplianceScan();
        container.innerHTML = `
            <div class="omni-card-gradient border border-slate-700 rounded-xl p-4 text-xs text-slate-100 shadow-md">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-bold uppercase tracking-wider text-indigo-400">AI Store Policy & Compliance Reviewer</span>
                    <span class="bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-2.5 py-0.5 rounded-full font-bold">Score: ${report.complianceScore}% (${report.status})</span>
                </div>
                <p class="text-slate-300 mt-1">${report.message}</p>
            </div>
        `;
    }

    renderTargetsTable() {
        const container = document.getElementById('omniTargetsContainer');
        if (!container) return;

        container.innerHTML = '';
        const targets = this.core.getTargets();

        targets.forEach(t => {
            let badgeClass = t.status.includes('Stable') || t.status.includes('Online') || t.status.includes('Ready') ? 'os-badge-active' : 'os-badge-queued';
            container.innerHTML += `
                <div class="omni-card-gradient border border-slate-700 rounded-xl p-4 mb-3 shadow-md flex justify-between items-center text-slate-100 transition hover:border-slate-600">
                    <div>
                        <div class="flex items-center space-x-2.5 mb-1.5 flex-wrap gap-y-1">
                            <span class="font-bold text-sm text-white">${t.name}</span>
                            <span class="text-xs font-mono font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">[${t.format}]</span>
                            <span class="text-[10px] px-2.5 py-0.5 rounded-full font-bold ${badgeClass}">${t.status}</span>
                        </div>
                        <p class="text-xs text-slate-400">Version: <strong class="text-indigo-400">${t.version}</strong> • Last Built: <span class="text-slate-300">${t.lastBuilt}</span></p>
                    </div>
                    <div>
                        <button onclick="window.triggerCloudBuild('${t.id}')" class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg transition font-semibold shadow-sm cursor-pointer">Build in Cloud</button>
                    </div>
                </div>
            `;
        });
    }

    renderBuildLogs() {
        const container = document.getElementById('omniLogsContainer');
        if (!container) return;

        container.innerHTML = '';
        if (this.core.buildLogs && this.core.buildLogs.length > 0) {
            this.core.buildLogs.forEach(log => {
                container.innerHTML += `
                    <div class="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs mb-2 flex justify-between items-center text-slate-300">
                        <div>
                            <span class="font-bold text-slate-200">${log.platform}</span> - <span class="text-slate-400">${log.action}</span>
                            <p class="text-slate-500 text-[10px] mt-0.5">${log.timestamp} • Status: <span class="text-emerald-400 font-semibold">${log.status}</span></p>
                        </div>
                    </div>
                `;
            });
        }
    }
}
