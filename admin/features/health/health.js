// admin/features/health/health.js

window.renderHealthModule = function(container) {
    container.innerHTML = `
        <div class="feature-card animate-fade">
            <div class="card-header">
                <h2>🩺 System Sentinel</h2>
                <p>Monitor real-time status of your API services and activity logs.</p>
            </div>
            
            <div class="status-grid">
                <div class="status-card">API Gateway: <span id="api-status" class="status-live">Checking...</span></div>
                <div class="status-card">Storage (Tele): <span id="tele-status" class="status-live">Checking...</span></div>
                <div class="status-card">Database: <span id="db-status" class="status-live">Checking...</span></div>
            </div>

            <h3 style="margin-top:25px;">Recent Activity Logs</h3>
            <table class="admin-table">
                <thead><tr><th>Time</th><th>Action</th><th>Status</th></tr></thead>
                <tbody id="logsTableBody"></tbody>
            </table>
        </div>
    `;
    fetchLogs();
};

async function fetchLogs() {
    // Firebase se logs fetch karo
    const logs = await fetch('/api/get-system-logs').then(r => r.json());
    const tbody = document.getElementById("logsTableBody");
    logs.forEach(log => {
        tbody.innerHTML += `<tr>
            <td>${log.timestamp}</td>
            <td>${log.action}</td>
            <td>${log.status === 'success' ? '✅' : '❌'}</td>
        </tr>`;
    });
}
