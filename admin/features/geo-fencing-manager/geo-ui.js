export class GeoUI {
    constructor(core) {
        this.core = core;
    }

    init() {
        this.render();
    }

    render() {
        this.renderKillSwitchStatus();
        this.renderCountryTable();
        this.renderAIAnalysis();
        this.renderGeoLogs();
    }

    renderKillSwitchStatus() {
        const container = document.getElementById('killSwitchContainer');
        if (!container) return;

        const active = this.core.globalKillSwitchActive;
        container.innerHTML = `
            <div class="${active ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'} border rounded-lg p-4 shadow-md flex justify-between items-center transition">
                <div>
                    <span class="text-xs uppercase tracking-wider font-bold opacity-80">Global Cyber Fortress Status</span>
                    <h3 class="text-base font-extrabold mt-0.5">${active ? 'PANIC LOCKDOWN ENGAGED (Site Offline)' : 'All Systems Operational (Normal Routing)'}</h3>
                </div>
                <div>
                    <button onclick="window.togglePanicKillSwitch()" class="text-xs bg-white text-slate-900 px-4 py-2 rounded font-extrabold shadow hover:bg-slate-100 transition">
                        ${active ? 'DEACTIVATE LOCKDOWN' : 'EMERGENCY PANIC KILL-SWITCH'}
                    </button>
                </div>
            </div>
        `;
    }

    renderCountryTable() {
        const container = document.getElementById('geoCountryContainer');
        if (!container) return;

        container.innerHTML = '';
        const countries = this.core.getCountries();

        countries.forEach(c => {
            let badge = c.status === 'Allowed' ? 'geo-badge-allowed' : 'geo-badge-blocked';
            container.innerHTML += `
                <div class="bg-white border rounded-lg p-3.5 mb-3 shadow-xs flex justify-between items-center">
                    <div>
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="font-bold text-sm text-gray-800">${c.name}</span>
                            <span class="text-xs font-mono font-bold text-gray-500">[${c.code}]</span>
                            <span class="text-[10px] px-2 py-0.5 rounded font-bold ${badge}">${c.status}</span>
                        </div>
                        <p class="text-xs text-gray-500">Currency: <strong class="text-indigo-600">${c.currency}</strong> • Gateway: ${c.gateway} • GDPR: ${c.gdprRequired ? 'Required' : 'Standard'} • Sub-blocks: ${c.subregionsBlocked}</p>
                    </div>
                    <div>
                        <button onclick="window.toggleGeoCountry('${c.code}')" class="text-xs bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800 transition font-semibold">Toggle Access</button>
                    </div>
                </div>
            `;
        });
    }

    renderAIAnalysis() {
        const container = document.getElementById('aiPredictiveContainer');
        if (!container) return;

        const report = this.core.runPredictiveShieldScan();
        container.innerHTML = `
            <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3.5 text-xs">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-indigo-900 uppercase">AI Predictive Shield & Bot Intelligence</span>
                    <span class="bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-bold">Confidence: ${report.aiConfidence}</span>
                </div>
                <p class="text-indigo-800 mt-1">${report.message}</p>
            </div>
        `;
    }

    renderGeoLogs() {
        const container = document.getElementById('geoLogsContainer');
        if (!container) return;

        container.innerHTML = '';
        this.core.geoLogs.forEach(log => {
            container.innerHTML += `
                <div class="bg-slate-50 border rounded p-2 text-xs mb-2 flex justify-between items-center">
                    <div>
                        <span class="font-bold text-gray-700">${log.country}</span> - <span class="text-gray-500">${log.action}</span>
                        <p class="text-gray-400 text-[10px]">${log.timestamp} • IP: ${log.ip} • Reason: ${log.reason}</p>
                    </div>
                </div>
            `;
        });
    }
}
