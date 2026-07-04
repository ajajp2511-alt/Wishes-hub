// ==========================================================
// 🎛️ WISHES HUB ADMIN - CORE DASHBOARD CONTROLLER (CRASH PROOF)
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

    // 3. Sidebar Responsive Toggle View Engine (Safe Checks Added)
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

    // 4. Trapping Clicks On Dynamic Sidebar Links (Safe Checks Added)
    function bindSidebarDynamicNavigation() {
        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('.nav-link') || e.target.closest('[data-feature]');
            if (!link) return;

            e.preventDefault();
            
            // Crash se bachne ke liye checks lagaye
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

            if (targetFeature === 'wishes') {
                loadLivePreviewComponent();
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
        
        // Agar config file missing hai ya dropdowns nahi mile, toh bina crash kiye silently ruk jao
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

    // 6. DYNAMIC MULTI-MEDIA COMPONENT WRITER
    async function loadLivePreviewComponent() {
        const workspaceArea = document.querySelector('.content-workspace');
        if (!workspaceArea) return;

        // Secure template injected directly to avoid fetching errors
        const secureComponentHtml = `
            <div class="feature-card">
                <h2 style="margin-bottom: 25px; color: var(--text-main); font-weight: 600;">Add New Multi-Media Wish</h2>
                
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-muted);">Main Category</label>
                    <select id="main-category">
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
                    <textarea id="wish-text" class="rich-editor" placeholder="Enter your wish text here..."></textarea>
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
                    <input type="file" id="wish-image" style="background: #f1f5f9; padding: 10px; border: 1px dashed var(--border); width: 100%; box-sizing: border-box;">
                </div>

                <div id="live-preview-box" style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;"></div>

                <button class="primary-action-btn" id="submit-wish-btn" style="margin-top: 20px; width: 100%; padding: 12px; background: #2563eb; color: white; font-weight: 600; border: none; border-radius: 6px; cursor: pointer;">Submit Wish</button>
            </div>
        `;

        workspaceArea.innerHTML = secureComponentHtml;
        populateRealCategories();

        // Safe check bindings taaki functions missing hone par crash na ho
        if (typeof initMediaUploaderFeature === 'function') {
            initMediaUploaderFeature();
        }
        if (typeof initVoiceRecorderFeature === 'function') {
            initVoiceRecorderFeature();
        }
    }

    // Default trigger
    loadLivePreviewComponent();
});
