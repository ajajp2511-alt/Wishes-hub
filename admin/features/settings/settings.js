// admin/features/settings/settings.js

window.renderSettingsModule = function(container) {
    container.innerHTML = `
        <link rel="stylesheet" href="../css/admin-logo-upload.css">

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

            <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;">

            <div class="logo-upload-card">
                <div class="card-header" style="padding: 0; margin-bottom: 15px;">
                    <h3>🖼️ Official Branding Logo</h3>
                    <p>Yahan se naya logo select karke upload karein. Upload hote hi user panel automatic sync ho jayega.</p>
                </div>
                
                <div class="logo-upload-container">
                    <div class="admin-current-logo">
                        <label>Live Admin & User Preview:</label>
                        <div class="brand-logo-target">
                            <span style="color: #888; font-size: 13px;">Loading current logo...</span>
                        </div>
                    </div>

                    <div class="upload-action-row">
                        <input type="file" id="admin-logo-input" accept="image/*" class="file-input">
                        <button id="btn-upload-logo" class="primary-action-btn" style="background-color: #28a745; margin-top: 0;">📤 Upload Logo</button>
                    </div>
                    
                    <span id="upload-status" class="upload-status-msg"></span>
                </div>
            </div>
            </div>
    `;

    // UI render hone ke thik baad Admin Logo Module ko initialize karna
    if (window.AdminLogoUploader && typeof window.AdminLogoUploader.init === 'function') {
        window.AdminLogoUploader.init();
    } else {
        // Agar script thoda der se load ho rahi ho toh safety safe-check
        setTimeout(() => {
            if (window.AdminLogoUploader) window.AdminLogoUploader.init();
        }, 300);
    }
};
