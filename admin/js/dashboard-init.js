// ==========================================================
// 🎛️ WISHES HUB ADMIN - CORE DASHBOARD CONTROLLER (FIXED)
// Patel Studio - 2026
// ==========================================================

if (performance.navigation.type === 1 || performance.getEntriesByType("navigation")[0].type === "reload") {
    sessionStorage.removeItem('isAdminLoggedIn');
}

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. SESSION Access Check
    if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = "/admin/pages/login.html";
        return;
    }

    console.log("Welcome to Secure Admin Panel Core Setup!");

    // 2. Load Sidebar
    const adminWrapper = document.querySelector('.admin-wrapper');
    if (adminWrapper) {
        try {
            let sidebarPath = '/admin/pages/sidebar.html';
            const response = await fetch(sidebarPath);
            if (response.status === 200) {
                const sidebarHtml = await response.text();
                adminWrapper.insertAdjacentHTML('afterbegin', sidebarHtml);
                
                // Sidebar HTML inject hone ke baad dynamic event controllers bind karein
                initSidebarToggleEngine();
                bindSidebarDynamicNavigation(); 
            }
        } catch (error) {
            document.querySelectorAll('.admin-wrapper ul li').forEach(li => li.classList.remove('active'));
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
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('show-sidebar');
                    }
                });
            }
        }
    }

    // ====================================================================
    // 🔥 NEW CRITICAL INTEGRATION: Trapping Clicks On Dynamic Sidebar Links
    // ====================================================================
    function bindSidebarDynamicNavigation() {
        // Document level delegation taaki dynamic links miss na ho skein
        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('.nav-link') || e.target.closest('[data-feature]');
            if (!link) return;

            e.preventDefault();
            
            // Purane links se active class hata kar current link par lagao
            document.querySelectorAll('.nav-link, [data-feature]').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const feature = link.getAttribute('data-feature') || '';
            const targetFeature = feature.toLowerCase().trim();
            const workspaceArea = document.querySelector('.content-workspace');

            if (!workspaceArea) return;

            console.log(`📡 Router routing screen focus to: ${targetFeature}`);

            if (targetFeature === 'wishes') {
                // Add Wish default framework layout render karein
                loadLivePreviewComponent();
            } 
            else if (targetFeature === 'settings') {
                // Settings module logic settings.js se trigger karein
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
                // Dusre features ka standard development placeholder
                workspaceArea.innerHTML = `
                    <div style="padding: 20px; color:#fff;">
                        <h2>📋 ${feature.toUpperCase()} Panel</h2>
                        <p style="color:#94a3b8; margin-top:10px;">This section is under active development.</p>
                    </div>`;
            }

            // Mobile view me click hote hi sidebar automatic close ho jaye
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('show-sidebar');
            }
        });
    }

    // 4. Dropdowns Populater Engine
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

    // 5. DYNAMIC HTML COMPONENT & MULTI-MEDIA LOGIC CONNECTOR
    async function loadLivePreviewComponent() {
        const workspaceArea = document.querySelector('.content-workspace');
        if (!workspaceArea) return;

        try {
            if (!document.getElementById('live-preview-css')) {
                const cssLink = document.createElement('link');
                cssLink.id = 'live-preview-css';
                cssLink.rel = 'stylesheet';
                cssLink.href = '/admin/css/live-preview-wish.css';
                document.head.appendChild(cssLink);
            }

            const response = await fetch('/admin/pages/live-preview-wish.html');
            if (response.status === 200) {
                const componentHtml = await response.text();
                workspaceArea.innerHTML = componentHtml;

                populateRealCategories();

                if (typeof initMediaUploaderFeature === 'function') {
                    initMediaUploaderFeature();
                    console.log("🚀 Connection Success: Media Uploader hooks activated perfectly!");
                } else {
                    console.warn("⚠️ Warning: initMediaUploaderFeature function nahi mila.");
                }
            }
        } catch (error) {
            console.error("Component connectivity broke:", error);
        }
    }

    // Trigger on load
    loadLivePreviewComponent();
});
