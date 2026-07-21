// ==========================================================
// 🎛️ WISHES HUB ADMIN - CORE DASHBOARD CONTROLLER (PRODUCTION)
// Patel Studio - 2026
// ==========================================================

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. SESSION Access Check
    if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = "/admin/pages/login.html";
        return;
    }

    console.log("Welcome to Secure Admin Panel Core Setup!");

    // 2. Load Sidebar Securely
    const adminWrapper = document.querySelector('.admin-wrapper');
    if (adminWrapper) {
        try {
            let sidebarPath = '/admin/pages/sidebar.html';
            const response = await fetch(sidebarPath);
            if (response.status === 200) {
                const sidebarHtml = await response.text();
                adminWrapper.insertAdjacentHTML('afterbegin', sidebarHtml);
                
                // Sidebar load hone ke BAAD hi functions ko trigger karein
                initSidebarToggleEngine();
                bindSidebarDynamicNavigation(); 
            }
        } catch (error) {
            console.error("Sidebar loading error:", error);
        }
    }

    // 3. Sidebar Responsive Toggle View Engine
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

    // 4. Trapping Clicks On Dynamic Sidebar Links
    function bindSidebarDynamicNavigation() {
        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('.nav-link') || e.target.closest('[data-feature]');
            if (!link) return;

            e.preventDefault();
            
            const allLinks = document.querySelectorAll('.nav-link, [data-feature]');
            if (allLinks.length > 0) {
                allLinks.forEach(l => l.classList.remove('active'));
            }
            link.classList.add('active');
            
            const feature = link.getAttribute('data-feature') || '';
            const targetFeature = feature.toLowerCase().trim();
            const workspaceArea = document.querySelector('.content-workspace');

            if (!workspaceArea) return;

            console.log(`📡 Router routing screen focus to: ${targetFeature}`);

            if (targetFeature === 'wishes' || targetFeature === 'add-wish') {
                loadLivePreviewComponent();
            } 
            else if (targetFeature === 'manage-wishes' || targetFeature === 'wishes-list') {
                loadWishesManagerComponent();
            }
            else if (targetFeature === 'settings') {
                if (typeof window.renderSettingsModule === 'function') {
                    window.renderSettingsModule(workspaceArea);
                } else {
                    workspaceArea.innerHTML = `
                        <div style="padding: 20px; color:#fff;">
                            <h2 style="color:#ff4a4a;">⚠️ Component Error</h2>
                            <p style="color:#94a3b8; margin-top:10px;">settings.js context is strictly missing or failed to initialize.</p>
                        </div>`;
                }
            } 
            else {
                workspaceArea.innerHTML = `
                    <div style="padding: 20px; color:#fff;">
                        <h2>📋 ${feature.toUpperCase()} Panel</h2>
                        <p style="color:#94a3b8; margin-top:10px;">This section is under active development.</p>
                    </div>`;
            }

            const sidebar = document.querySelector('.sidebar');
            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('show-sidebar');
            }
        });
    }

    // 5. Dropdowns Populater Engine (Strict Global Protection)
    function populateRealCategories() {
        const mainCatDropdown = document.getElementById('main-category');
        const subCatDropdown = document.getElementById('sub-category');
        
        if (typeof categoriesConfig === 'undefined' || !mainCatDropdown || !subCatDropdown) {
            console.log("Waiting for category config script to initialize...");
            return;
        }

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

    // 6. DYNAMIC MULTI-MEDIA COMPONENT WRITER (ADD NEW WISH)
    async function loadLivePreviewComponent() {
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
                    <button type="button" id="btn-view-all-wishes" style="background:#10b981; color:#fff; border:none; padding:10px 16px; border-radius:6px; cursor:pointer; font-weight:600;">📋 View / Manage All Wishes</button>
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

                    <button type="button" id="submit-wish-btn" style="margin-top: 20px; width: 100%; padding: 12px; background: #2563eb; color: white; font-weight: 600; border: none; border-radius: 6px; cursor: pointer;">Submit Wish</button>
                </form>
            </div>
        `;

        workspaceArea.innerHTML = secureComponentHtml;
        populateRealCategories();

        // 🔥 View / Manage All Wishes button click listener
        const manageBtn = document.getElementById('btn-view-all-wishes');
        if (manageBtn) {
            manageBtn.addEventListener('click', () => {
                loadWishesManagerComponent();
            });
        }

        if (typeof initMediaUploaderFeature === 'function') initMediaUploaderFeature();
        if (typeof initVoiceRecorderFeature === 'function') initVoiceRecorderFeature();

        if (window.AnimationManager && typeof window.AnimationManager.bindEvents === 'function') {
            window.AnimationManager.bindEvents();
        }

        const inlineSelect = document.getElementById('wish-animation');
        if (inlineSelect) {
            inlineSelect.addEventListener('change', (e) => {
                if (window.AnimationPreviewLinker && typeof window.AnimationPreviewLinker.showPreview === 'function') {
                    const liveBox = document.getElementById('live-preview-box');
                    if (liveBox) liveBox.style.display = "block";
                    window.AnimationPreviewLinker.showPreview(e.target.value);
                }
            });
        }

        const submissionBtn = document.getElementById('submit-wish-btn');
        if (submissionBtn) {
            submissionBtn.addEventListener('click', async () => {
                await triggerSystemUploadEngine();
            });
        }
    }

    // 7. CORE RUNTIME UPLOAD TRANSMITTER
    async function triggerSystemUploadEngine() {
        const statusBox = document.getElementById('status-box-system');
        if (!statusBox) return;

        statusBox.style.display = "block";
        statusBox.style.color = "#ffea00";
        statusBox.innerText = "⏳ Processing fields and verifying network stack...";

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
                statusBox.innerText = "⚡ Converting media data chunk to Base64 stream...";
                const file = fileInput.files[0];
                base64String = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            }

            statusBox.innerText = "📡 Routing package stream to server pipeline...";

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
                statusBox.innerText = "✅ Success! Data seamlessly pushed onto the engine database.";
                statusBox.style.color = "#00ff88";
                
                document.getElementById('wish-text').value = "";
                document.getElementById('main-category').value = "";
                document.getElementById('sub-category').value = "";
                if (fileInput) fileInput.value = "";

                if (window.AnimationSelector && typeof window.AnimationSelector.reset === 'function') {
                    window.AnimationSelector.reset();
                }

                const liveBox = document.getElementById('live-preview-box');
                if (liveBox) liveBox.style.display = "none";
            } else {
                throw new Error(result.message || "Pipeline rejected packet entry.");
            }

        } catch (err) {
            statusBox.innerText = "🚨 Runtime Error: " + err.message;
            statusBox.style.color = "#ff4a4a";
            alert("Upload Process Suspended: " + err.message);
        }
    }

    // 🔥 8. ALL WISHES LIST VIEW & MANAGE (EDIT / DELETE) COMPONENT
    async function loadWishesManagerComponent() {
        const workspaceArea = document.querySelector('.content-workspace');
        if (!workspaceArea) return;

        workspaceArea.innerHTML = `
            <div class="feature-card" style="padding:20px; background:#0f172a; border-radius:12px; color:#fff;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                    <h2 style="color: #f8fafc; font-weight: 600; margin:0;">📋 All Database Wishes</h2>
                    <button id="btn-back-to-add" style="background:#2563eb; color:#fff; border:none; padding:10px 18px; border-radius:6px; cursor:pointer; font-weight:600;">➕ Add New Wish</button>
                </div>
                
                <div id="wishes-table-status" style="color:#fbbf24; font-weight:bold; padding:15px 0;">⏳ Loading database wishes...</div>
                
                <div style="overflow-x:auto;">
                    <table style="width:100%; border-collapse:collapse; margin-top:10px; color:#fff; text-align:left;">
                        <thead>
                            <tr style="border-bottom:2px solid #334155; background:#1e293b;">
                                <th style="padding:12px;">Image</th>
                                <th style="padding:12px;">Wish Text</th>
                                <th style="padding:12px;">Category</th>
                                <th style="padding:12px; text-align:center;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="wishes-table-body"></tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('btn-back-to-add').addEventListener('click', () => {
            loadLivePreviewComponent();
        });

        try {
            const res = await fetch('/api/get-wishes');
            const data = await res.json();

            const statusText = document.getElementById('wishes-table-status');
            const tbody = document.getElementById('wishes-table-body');

            if (data.success && data.wishes && data.wishes.length > 0) {
                statusText.style.display = "none";
                
                tbody.innerHTML = data.wishes.map(wish => `
                    <tr style="border-bottom:1px solid #334155;">
                        <td style="padding:10px;">
                            ${wish.image ? `<img src="${wish.image}" style="width:45px; height:45px; object-fit:cover; border-radius:6px;">` : '<span style="color:#64748b;">No Img</span>'}
                        </td>
                        <td style="padding:10px; max-width:260px; word-wrap:break-word; color:#e2e8f0;">
                            ${wish.title || wish.wishText || 'N/A'}
                        </td>
                        <td style="padding:10px;">
                            <span style="background:#334155; color:#38bdf8; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold;">${wish.category || 'General'}</span>
                        </td>
                        <td style="padding:10px; text-align:center;">
                            <button class="btn-edit-action" data-id="${wish.id}" data-text="${encodeURIComponent(wish.title || '')}" data-cat="${encodeURIComponent(wish.category || '')}" style="background:#f59e0b; color:#fff; border:none; padding:6px 12px; border-radius:5px; cursor:pointer; margin-right:6px; font-weight:bold;">✏️ Edit</button>
                            <button class="btn-delete-action" data-id="${wish.id}" style="background:#ef4444; color:#fff; border:none; padding:6px 12px; border-radius:5px; cursor:pointer; font-weight:bold;">🗑️ Delete</button>
                        </td>
                    </tr>
                `).join('');

                // 🗑️ Delete Button Engine
                document.querySelectorAll('.btn-delete-action').forEach(btn => {
                    btn.onclick = async (e) => {
                        const wishId = e.currentTarget.getAttribute('data-id');
                        if (confirm("Kya aap sach me is wish ko delete karna chahte hain?")) {
                            try {
                                const delRes = await fetch(`/api/manage-wish?id=${wishId}`, { method: 'DELETE' });
                                const delData = await delRes.json();
                                if (delData.success) {
                                    alert("✅ Wish deleted successfully!");
                                    loadWishesManagerComponent();
                                } else {
                                    alert("❌ Error: " + delData.message);
                                }
                            } catch (err) {
                                alert("Delete failed: " + err.message);
                            }
                        }
                    };
                });

                // ✏️ Edit Button Engine
                document.querySelectorAll('.btn-edit-action').forEach(btn => {
                    btn.onclick = async (e) => {
                        const wishId = e.currentTarget.getAttribute('data-id');
                        const oldText = decodeURIComponent(e.currentTarget.getAttribute('data-text'));
                        const oldCat = decodeURIComponent(e.currentTarget.getAttribute('data-cat'));

                        const updatedText = prompt("Wish Text Edit Karein:", oldText);
                        if (updatedText === null) return;

                        const updatedCat = prompt("Category Edit Karein:", oldCat);
                        if (updatedCat === null) return;

                        try {
                            const updateRes = await fetch(`/api/manage-wish?id=${wishId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ title: updatedText, category: updatedCat })
                            });
                            const updateData = await updateRes.json();

                            if (updateData.success) {
                                alert("✅ Wish update ho gayi!");
                                loadWishesManagerComponent();
                            } else {
                                alert("❌ Update Failed: " + updateData.message);
                            }
                        } catch (err) {
                            alert("Update failed: " + err.message);
                        }
                    };
                });

            } else {
                statusText.innerText = "❌ Database me koi wish nahi mili.";
                statusText.style.color = "#ef4444";
            }

        } catch (err) {
            document.getElementById('wishes-table-status').innerText = "🚨 Error loading wishes: " + err.message;
        }
    }

    loadLivePreviewComponent();
});
