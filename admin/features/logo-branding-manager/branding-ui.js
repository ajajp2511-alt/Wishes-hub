export class BrandingUI {
    constructor(core) {
        this.core = core;
    }

    init() {
        this.render();
    }

    render() {
        this.renderAiAuditSummary();
        this.renderPlacementsTable();
        this.renderBrandingLogs();
    }

    renderAiAuditSummary() {
        const container = document.getElementById('aiBrandingAuditContainer');
        if (!container) return;

        const audit = this.core.runAiBrandAudit();
        container.innerHTML = `
            <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3.5 text-xs">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-indigo-900 uppercase">AI Brand Guidelines & Accessibility Auditor</span>
                    <span class="bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-bold">${audit.wcagScore}</span>
                </div>
                <p class="text-indigo-800 mt-1">Extracted Palette: <strong class="font-mono">${audit.palette.join(', ')}</strong> • Watermark Security: ${audit.cryptoWatermarkStatus}</p>
            </div>
        `;
    }

    renderPlacementsTable() {
        const container = document.getElementById('brandingPlacementsContainer');
        if (!container) return;

        container.innerHTML = '';
        const placements = this.core.getPlacements();

        placements.forEach(p => {
            let badgeClass = p.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600';
            let btnClass = p.enabled ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700';
            container.innerHTML += `
                <div class="bg-white border rounded-lg p-3.5 mb-3 shadow-xs flex justify-between items-center">
                    <div>
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="font-bold text-sm text-gray-800">${p.name}</span>
                            <span class="text-[10px] px-2 py-0.5 rounded font-bold ${badgeClass}">${p.enabled ? 'VISIBLE (ON)' : 'HIDDEN (OFF)'}</span>
                        </div>
                        <p class="text-xs text-gray-500">Category: <strong class="text-indigo-600">${p.category}</strong></p>
                    </div>
                    <div>
                        <button onclick="window.togglePlacementVisibility('${p.id}')" class="text-xs text-white px-3 py-1.5 rounded transition font-semibold ${btnClass}">
                            ${p.enabled ? 'Turn OFF' : 'Turn ON'}
                        </button>
                    </div>
                </div>
            `;
        });
    }

    renderBrandingLogs() {
        const container = document.getElementById('brandingLogsContainer');
        if (!container) return;

        container.innerHTML = '';
        this.core.brandingLogs.forEach(log => {
            container.innerHTML += `
                <div class="bg-slate-50 border rounded p-2 text-xs mb-2 flex justify-between items-center">
                    <div>
                        <span class="font-bold text-gray-700">${log.action}</span>
                        <p class="text-gray-400 text-[10px]">${log.timestamp} • Status: ${log.status}</p>
                    </div>
                </div>
            `;
        });
    }
}
