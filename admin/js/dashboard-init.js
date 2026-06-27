// ==========================================================
// 🎛️ WISHES HUB ADMIN - CORE DASHBOARD CONTROLLER (FIXED)
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
                initSidebarToggleEngine();
            }
        } catch (error) {
            console.error("Sidebar loading error:", error);
        }
    }

    // 3. Sidebar Engine
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

    // 🔴 5. DYNAMIC HTML COMPONENT & MULTI-MEDIA LOGIC CONNECTOR
    async function loadLivePreviewComponent() {
        const workspaceArea = document.querySelector('.content-workspace');
        if (!workspaceArea) return;

        try {
            // A. CSS File load karein head me
            if (!document.getElementById('live-preview-css')) {
                const cssLink = document.createElement('link');
                cssLink.id = 'live-preview-css';
                cssLink.rel = 'stylesheet';
                cssLink.href = '/admin/css/live-preview-wish.css';
                document.head.appendChild(cssLink);
            }

            // B. HTML Component load karein workspace me
            const response = await fetch('/admin/pages/live-preview-wish.html');
            if (response.status === 200) {
                const componentHtml = await response.text();
                workspaceArea.innerHTML = componentHtml;

                // C. Config categories fill karein
                populateRealCategories();

                // D. 🛠️ Nayi dynamic multi-media feature script logic ko fire karein
                if (typeof initMediaUploaderFeature === 'function') {
                    initMediaUploaderFeature();
                    console.log("🚀 Connection Success: Media Uploader hooks activated perfectly!");
                } else {
                    console.warn("⚠️ Warning: initMediaUploaderFeature function nahi mila. Check karein ki media-uploader.js html me script tag me add hai ya nahi.");
                }
            }
        } catch (error) {
            console.error("Component connectivity broke:", error);
        }
    }

    // Trigger on load
    loadLivePreviewComponent();
});
