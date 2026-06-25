// ==========================================================
// 🎛️ WISHES HUB ADMIN - DASHBOARD INITIALIZER & SUBMIT LOGIC
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
        
        if (typeof categoriesConfig === 'undefined') {
            console.error("Critical: categoriesConfig data not found!");
            return;
        }

        if (!mainCatDropdown || !subCatDropdown) return;

        // Main Category Options Fill karein
        Object.keys(categoriesConfig).forEach(mainCat => {
            let opt = document.createElement('option');
            opt.value = mainCat;
            opt.innerText = mainCat;
            mainCatDropdown.appendChild(opt);
        });

        // Main Category Change Event Listener
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

    // 5. SUBMIT WISH BUTTON WORK ENGINE
    const submitBtn = document.getElementById('submit-wish-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const mainCategory = document.getElementById('main-category').value;
            const subCategory = document.getElementById('sub-category').value;
            const wishText = document.getElementById('wish-text').value.trim();
            const imageFile = document.getElementById('wish-image').files[0];

            // Form Validation Checks
            if (!mainCategory || !subCategory || !wishText) {
                alert("⚠️ Please fill out Main Category, Sub Category, and Wish Text!");
                return;
            }

            submitBtn.innerText = "⏳ Submitting...";
            submitBtn.disabled = true;

            const formData = new FormData();
            formData.append('mainCategory', mainCategory);
            formData.append('subCategory', subCategory);
            formData.append('wishText', wishText);
            if (imageFile) {
                formData.append('wishImage', imageFile);
            }

            try {
                // 🔴 CORRECTION: Sahi file path lagaya jo Vercel serverless function ko hit karega
                const response = await fetch('/api/add-wish-to-db', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.status === 200 || result.success) {
                    alert("🎉 Wish successfully uploaded and added to Database!");
                    
                    // Fields reset after success
                    document.getElementById('wish-text').value = "";
                    document.getElementById('wish-image').value = "";
                    document.getElementById('main-category').value = "";
                    document.getElementById('sub-category').innerHTML = '<option value="">Select Sub Category</option>';
                } else {
                    alert(`❌ Server Error: ${result.message || 'Submission failed.'}`);
                }
            } catch (error) {
                console.error("Form Submission Error:", error);
                alert("🚨 Network Error: Backend server response nahi de raha!");
            } finally {
                submitBtn.innerText = "Submit Wish";
                submitBtn.disabled = false;
            }
        });
    }
});
