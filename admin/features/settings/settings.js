// admin/features/settings/settings.js

window.renderSettingsModule = function(container) {
    container.innerHTML = `
        <div class="feature-card animate-fade">
            <div class="card-header">
                <h2>⚙️ Global System Settings</h2>
                <p>Manage your site configuration and API credentials remotely.</p>
            </div>
            
            <div class="form-group">
                <label>Maintenance Mode</label>
                <select id="siteStatus">
                    <option value="active">Live (Active)</option>
                    <option value="maintenance">Maintenance Mode</option>
                </select>
            </div>

            <div class="form-group">
                <label>Update Telegram Bot Token</label>
                <input type="password" id="teleToken" placeholder="New Bot Token">
            </div>

            <button class="primary-action-btn" onclick="saveSettings()">💾 Save Global Config</button>
        </div>
    `;
};
