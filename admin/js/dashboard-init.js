// ==========================================================
// 🎛️ WISHES HUB ADMIN - DASHBOARD INITIALIZER & REAL DATA CONNECT
// ==========================================================

// Security setup: Page refresh hote hi logout kar do
if (performance.navigation.type === 1 || performance.getEntriesByType("navigation")[0].type === "reload") {
    sessionStorage.removeItem('isAdminLoggedIn');
}

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. SESSION CONTROL
    if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = "/admin/pages/login.html";
        return;
    }

    console.log("Welcome to Secure Admin Panel Dashboard!");

    // 2. FETCH DYNAMIC SIDEBAR TEMPLATE
    const adminWrapper = document.querySelector('.admin-wrapper');
    if (adminWrapper) {
        try {
            let sidebarPath = '/admin/pages/sidebar.html';
            const response = await fetch(sidebarPath);
            
            if (response.status === 200) {
                const sidebarHtml = await response.text();
                adminWrapper.insertAdjacentHTML('afterbegin', sidebarHtml);
                console.log("Sidebar Loaded Successfully!");
                initSidebarToggleEngine();
            } else {
                console.error("Error: sidebar.html template not found!");
            }
        } catch (error) {
            console.error("AJAX Error loading sidebar layout:", error);
        }
    }

    // 3. ☰ BUTTON TOGGLE ENGINE
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

    // 4. REAL DYNAMIC DROPDOWNS LOGIC
    populateRealCategories();

    function populateRealCategories() {
        const mainCatDropdown = document.getElementById('main-category');
        const subCatDropdown = document.getElementById('sub-category');
        
        // Check karein ki file load hui hai ya nahi
        if (typeof categoriesConfig === 'undefined') {
            console.error("Critical: categoriesConfig data not found! Path check karein.");
            return;
        }

        if (!mainCatDropdown || !subCatDropdown) return;

        // A. Main Category Options Fill karein
        Object.keys(categoriesConfig).forEach(mainCat => {
            let opt = document.createElement('option');
            opt.value = mainCat;
            opt.innerText = mainCat;
            mainCatDropdown.appendChild(opt);
        });

        // B. Main Category Change Event Listener (Sub Category badalne ke liye)
        mainCatDropdown.addEventListener('change', function() {
            const selectedMain = this.value;
            
            // Sub category dropdown ko reset karein
            subCatDropdown.innerHTML = '<option value="">Select Sub Category</option>';
            
            if (selectedMain && categoriesConfig[selectedMain]) {
                // Sahi sub categories loop karke fill karein
                categoriesConfig[selectedMain].forEach(subCat => {
                    let opt = document.createElement('option');
                    opt.value = subCat;
                    opt.innerText = subCat;
                    subCatDropdown.appendChild(opt);
                });
            }
        });
    }
});
