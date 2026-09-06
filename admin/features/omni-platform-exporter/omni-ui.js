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
            <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3.5 text-xs">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-indigo-900 uppercase">AI Store Policy & Compliance Reviewer</span>
                    <span class="bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-bold">Score: ${report.complianceScore}% (${report.status})</span>
                </div>
                <p class="text-indigo-800 mt-1">${report.message}</p>
            </div>
        `;
    }

    renderTargetsTable() {
        const container = document.getElementById('omniTargetsContainer');
        if (!container) return;

        container.innerHTML = '';
        const targets = this.core.getTargets();

        targets.forEach(t => {
            let badge = t.status.includes('Stable') || t.status.includes('Online') ? 'os-badge-active' : 'os-badge-queued';
            container.innerHTML += `
                <div class="bg-white border rounded-lg p-3.5 mb-3 shadow-xs flex justify-between items-center">
                    <div>
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="font-bold text-sm text-gray-800">${t.name}</span>
                            <span class="text-xs font-mono font-bold text-gray-500">[${t.format}]</span>
                            <span class="text-[10px] px-2 py-0.5 rounded font-bold ${badge}">${t.status}</span>
                        </div>
                        <p class="text-xs text-gray-500">Version: <strong class="text-indigo-600">${t.version}</strong> • Last Built: ${t.lastBuilt}</p>
                    </div>
                    <div>
                        <button onclick="window.triggerCloudBuild('${t.id}')" class="text-xs bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800 transition font-semibold">Build in Cloud</button>
                    </div>
                </div>
            `;
        });
    }

    renderBuildLogs() {
        const container = document.getElementById('omniLogsContainer');
        if (!container) return;

        container.innerHTML = '';
        this.core.buildLogs.forEach(log => {
            container.innerHTML += `
                <div class="bg-slate-50 border rounded p-2 text-xs mb-2 flex justify-between items-center">
                    <div>
                        <span class="font-bold text-gray-700">${log.platform}</span> - <span class="text-gray-500">${log.action}</span>
                        <p class="text-gray-400 text-[10px]">${log.timestamp} • Status: ${log.status}</p>
                    </div>
                </div>
            `;
        });
    }
}
