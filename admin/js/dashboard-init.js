// ==========================================================
// 🎛️ WISHES HUB ADMIN - CORE DASHBOARD CONTROLLER (PRODUCTION)
// Patel Studio - 2026
// ==========================================================

// ----------------------------------------------------------
// 🌐 GLOBAL FUNCTIONS FOR DIRECT HTML BINDING
// ----------------------------------------------------------

// 1. ALL WISHES LIST VIEW & MANAGE ENGINE (CARD FORMAT WITH EDIT/DELETE)
window.loadWishesManagerComponent = async function() {
    const workspaceArea = document.querySelector('.content-workspace');
    if (!workspaceArea) return;

    workspaceArea.innerHTML = `
        <div class="feature-card" style="padding:20px; background:#0f172a; border-radius:12px; color:#fff;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                <h2 style="color: #f8fafc; font-weight: 600; margin:0;">📋 All Database Wishes</h2>
                <button type="button" onclick="window.loadLivePreviewComponent()" style="background:#2563eb; color:#fff; border:none; padding:10px 18px; border-radius:6px; cursor:pointer; font-weight:600;">➕ Add New Wish</button>
            </div>
            
            <p style="color:#94a3b8; font-size:13px; margin-bottom:15px;">💡 Note: Har wish ke aage Edit ✏️ aur Delete 🗑️ ka option diya gaya hai.</p>

            <div id="wishes-table-status" style="color:#fbbf24; font-weight:bold; padding:15px 0;">⏳ Loading database wishes...</div>
            
            <div id="wishes-cards-container" style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;"></div>
        </div>
    `;

    try {
        const res = await fetch('/api/get-wishes');
        const data = await res.json();

        const statusText = document.getElementById('wishes-table-status');
        const container = document.getElementById('wishes-cards-container');

        if (data.success && data.wishes && data.wishes.length > 0) {
            statusText.style.display = "none";
            
            container.innerHTML = data.wishes.map(wish => {
                const safeText = encodeURIComponent(wish.title || wish.wishText || '');
                const safeCat = encodeURIComponent(wish.category || '');
                return `
                    <div style="background:#1e293b; padding:15px; border-radius:10px; border:1px solid #334155; display:flex; justify-content:space-between; align-items:center; gap:12px;">
                        <div style="display:flex; align-items:center; gap:12px; width:70%;">
                            ${wish.image ? `<img src="${wish.image}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">` : '<div style="width:50px; height:50px; background:#334155; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#94a3b8;">No Img</div>'}
                            <div>
                                <h4 style="margin:0; color:#f8fafc; font-size:15px; line-height:1.3;">${wish.title || wish.wishText || 'N/A'}</h4>
                                <span style="display:inline-block; margin-top:5px; background:#334155; color:#38bdf8; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:bold;">${wish.category || 'General'}</span>
                            </div>
                        </div>
                        <div style="display:flex; gap:6px;">
                            <button type="button" onclick="window.editWishAction('${wish.id}', '${safeText}', '${safeCat}')" style="background:#f59e0b; color:#fff; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">✏️ Edit</button>
                            <button type="button" onclick="window.deleteWishAction('${wish.id}')" style="background:#ef4444; color:#fff; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:bold; font-size:12px;">🗑️ Delete</button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            statusText.innerText = "❌ Database me koi wish nahi mili.";
            statusText.style.color = "#ef4444";
        }
    } catch (err) {
        const statusText = document.getElementById('wishes-table-status');
        if (statusText) {
            statusText.innerText = "🚨 Error loading wishes: " + err.message;
        }
    }
};

// 2. GLOBAL DELETE FUNCTION
window.deleteWishAction = async function(id) {
    if (confirm("Kya aap sach me is wish ko delete karna chahte hain?")) {
        try {
            const delRes = await fetch(`/api/manage-wish?id=${id}`, { method: 'DELETE' });
            const delData = await delRes.json();
            if (delData.success) {
                alert("✅ Wish deleted successfully!");
                window.loadWishesManagerComponent();
            } else {
                alert("❌ Error: " + delData.message);
            }
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    }
};

// 3. GLOBAL EDIT FUNCTION
window.editWishAction = async function(id, text, cat) {
    const oldText = decodeURIComponent(text);
    const oldCat = decodeURIComponent(cat);

    const updatedText = prompt("Wish Text Edit Karein:", oldText);
    if (updatedText === null) return;

    const updatedCat = prompt("Category Edit Karein:", oldCat);
    if (updatedCat === null) return;

    try {
        const updateRes = await fetch(`/api/manage-wish?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: updatedText, category: updatedCat })
        });
        const updateData = await updateRes.json();

        if (updateData.success) {
            alert("✅ Wish update ho gayi!");
            window.loadWishesManagerComponent();
        } else {
            alert("❌ Update Failed: " + updateData.message);
        }
    } catch (err) {
        alert("Update failed: " + err.message);
    }
};

// 4. ADD NEW WISH COMPONENT
window.loadLivePreviewComponent = async function() {
    const workspaceArea = document.querySelector('.content-workspace');
    if (!workspaceArea) return;

    const animationSelectorHtml = (window.AnimationSelector && typeof window.AnimationSelector.render === 'function')
        ? window.AnimationSelector.render()
        : `<div class="form-group" style="margin-top: 15px; padding: 10px; border: 1px dashed red; border-radius: 6px;">
               <label style="color: #ff4a4a; font-weight: bold;">⚠️ Animation selector failed to load dynamically</label>
           </div>`;

    const secureComponentHtml = `
        <div class="feature-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 25px;">
                <h2 style="color: var(--text-main); font-weight: 600; margin:0;">Add New Multi-Media Wish</h2>
                <button type="button" id="btn-view-all-wishes" onclick="window.loadWishesManagerComponent()" style="background:#10b981; color:#fff; border:none; padding:10px 16px; border-radius:6px; cursor:pointer; font-weight:600;">📋 View / Manage All Wishes</button>
            </div>
            
            <form id="wishFormSandbox">
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Main Category</label>
                    <select id="main-category" required>
                        <option value="">Select Main Category</option>
                    </select>
                </div>

                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Sub Category</label>
                    <select id="sub-category">
                        <option value="">Select Sub Category</option>
                    </select>
                </div>

                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Wish Content Text</label>
                    <textarea id="wish-text" class="rich-editor" required placeholder="Enter your wish text here..."></textarea>
                </div>

                <div class="form-group" style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">YouTube URL (Optional)</label>
                    <input type="text" id="youtube-url" placeholder="https://www.youtube.com/watch?v=..." style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 6px; background: #fff; box-sizing: border-box;">
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button type="button" id="search-yt-btn" style="background: #4f46e5; color: white; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">🔍 Search on YouTube</button>
                    <button type="button" id="start-rec-btn" style="background: #ef4444; color: white; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">🔴 Record Voice</button>
                    <button type="button" id="stop-rec-btn" disabled style="background: #64748b; color: white; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Stop</button>
                </div>

                <div id="voice-preview-container" style="margin-bottom: 15px;"></div>

                <div class="form-group" style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Search Song / Track</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="song-search-query" placeholder="Type song name, artist, or movie..." style="flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 6px; background: #fff;">
                        <button type="button" id="track-search-btn" style="background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Search</button>
                    </div>
                    <div id="song-results-container" style="margin-top: 10px;"></div>
                </div>

                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Upload Feature Image</label>
                    <input type="file" id="wish-image-file" accept="image/*" style="background: #f1f5f9; padding: 10px; border: 1px dashed var(--border); width: 100%; box-sizing: border-box;">
                </div>

                <div id="animation-selector-placeholder">
                    ${animationSelectorHtml}
                </div>

                <div id="live-preview-box" style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; display: none;"></div>
                <div id="status-box-system" style="margin-top: 15px; padding: 12px; border-radius: 6px; background: #1e293b; color: #ffea00; font-weight: bold; display: none;"></div>

                <button type="button" id="submit-wish-btn" onclick="window.triggerSystemUploadEngine()" style="margin-top: 20px; width: 100%; padding: 12px; background: #2563eb; color: white; font-weight: 600; border: none; border-radius: 6px; cursor: pointer;">Submit Wish</button>
            </form>
        </div>
    `;

    workspaceArea.innerHTML = secureComponentHtml;
    populateRealCategories();

    if (typeof initMediaUploaderFeature === 'function') initMediaUploaderFeature();
    if (typeof initVoiceRecorderFeature === 'function') initVoiceRecorderFeature();

    if (window.AnimationManager && typeof window.AnimationManager.bindEvents === 'function') {
        window.AnimationManager.bindEvents();
    }
};

// 5. UPLOAD TRANSMITTER ENGINE
window.triggerSystemUploadEngine = async function() {
    const statusBox = document.getElementById('status-box-system');
    if (!statusBox) return;

    statusBox.style.display = "block";
    statusBox.style.color = "#ffea00";
    statusBox.innerText = "⏳ Processing fields...";

    const textVal = document.getElementById('wish-text').value.trim();
    const categoryVal = document.getElementById('main-category').value;
    
    const animationVal = (window.AnimationSelector && typeof window.AnimationSelector.getValue === 'function')
        ? window.AnimationSelector.getValue()
        : 'none';

    if (!textVal || !categoryVal) {
        statusBox.innerText = "❌ Error: Category aur Wish Text fill karna mandatory hai!";
        statusBox.style.color = "#ff4a4a";
        return;
    }

    try {
        const fileInput = document.getElementById('wish-image-file');
        let base64String = null;

        if (fileInput && fileInput.files.length > 0) {
            statusBox.innerText = "⚡ Converting image...";
            const file = fileInput.files[0];
            base64String = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        statusBox.innerText = "📡 Sending to server...";

        let payload = {
            title: textVal,
            category: categoryVal,
            sub_category: document.getElementById('sub-category').value || '',
            image: base64String,
            animation: animationVal
        };

        const response = await fetch('/api/add-wish-to-db', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            statusBox.innerText = "✅ Success! Wish saved to database.";
            statusBox.style.color = "#00ff88";
            
            document.getElementById('wish-text').value = "";
            document.getElementById('main-category').value = "";
            document.getElementById('sub-category').value = "";
            if (fileInput) fileInput.value = "";
        } else {
            throw new Error(result.message || "Upload failed.");
        }

    } catch (err) {
        statusBox.innerText = "🚨 Error: " + err.message;
        statusBox.style.color = "#ff4a4a";
    }
};

// ----------------------------------------------------------
// 🛠️ INTERNAL HELPER FUNCTIONS
// ----------------------------------------------------------

function populateRealCategories() {
    const mainCatDropdown = document.getElementById('main-category');
    const subCatDropdown = document.getElementById('sub-category');
    
    if (typeof categoriesConfig === 'undefined' || !mainCatDropdown || !subCatDropdown) return;

    mainCatDropdown.innerHTML = '<option value="">Select Main Category</option>';

    Object.keys(categoriesConfig).forEach(mainCat => {
        let opt = document.createElement('option');
        opt.value = mainCat;
        opt.innerText = mainCat;
        mainCatDropdown.appendChild(opt);
    });

    mainCatDropdown.addEventListener('change', function() {
        const selectedMain = this.value;
        subCatDropdown.innerHTML = '<option value="">Select Sub Category</option>';
        if (selectedMain && categoriesConfig[selectedMain]) {
            categoriesConfig[selectedMain].forEach(subCat => {
                let opt = document.createElement('option');
                opt.value = subCat;
                opt.innerText = subCat;
                subCatDropdown.appendChild(opt);
            });
        }
    });
}

// ----------------------------------------------------------
// 🚀 INIT ENGINE ON DOM LOAD
// ----------------------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Session check
    if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = "/admin/pages/login.html";
        return;
    }

    // 2. Load Sidebar dynamically
    const adminWrapper = document.querySelector('.admin-wrapper');
    if (adminWrapper) {
        try {
            let sidebarPath = '/admin/pages/sidebar.html';
            const response = await fetch(sidebarPath);
            if (response.status === 200) {
                const sidebarHtml = await response.text();
                adminWrapper.insertAdjacentHTML('afterbegin', sidebarHtml);
                initSidebarToggleEngine();
                bindSidebarDynamicNavigation(); 
            }
        } catch (error) {
            console.error("Sidebar error:", error);
        }
    }

    function initSidebarToggleEngine() {
        const toggleBtn = document.getElementById('toggle-sidebar-btn');
        const sidebar = document.querySelector('.sidebar');
        const workspace = document.querySelector('.content-workspace');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.innerWidth <= 768) {
                    sidebar.classList.toggle('show-sidebar');
                } else {
                    sidebar.classList.toggle('hide');
                }
            });
            if (workspace) {
                workspace.addEventListener('click', () => {
                    if (sidebar && window.innerWidth <= 768) {
                        sidebar.classList.remove('show-sidebar');
                    }
                });
            }
        }
    }

    // 🔥 DYNAMIC ROUTING ACCORDING TO DATA-FEATURE IN SIDEBAR
    function bindSidebarDynamicNavigation() {
        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('.nav-link') || e.target.closest('[data-feature]');
            if (!link) return;

            e.preventDefault();

            // Active Class Highlight Update
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const feature = link.getAttribute('data-feature') || '';

            // EXACT ROUTING MAP
            if (feature === 'manager') {
                window.loadWishesManagerComponent();
            } 
            else if (feature === 'wishes') {
                window.loadLivePreviewComponent();
            }
            else if (feature === 'settings') {
                if (typeof window.renderSettingsModule === 'function') {
                    window.renderSettingsModule(document.querySelector('.content-workspace'));
                }
            } else {
                const workspaceArea = document.querySelector('.content-workspace');
                if (workspaceArea) {
                    workspaceArea.innerHTML = `<div style="padding:20px; color:#fff;"><h2>📋 ${feature.toUpperCase()}</h2><p style="color:#94a3b8;">Feature coming soon...</p></div>`;
                }
            }

            // Close Mobile Sidebar after click
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('show-sidebar');
            }
        });
    }

    // Default view load
    window.loadLivePreviewComponent();
});
