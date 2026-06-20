// Wishes Hub: Master Admin UI Controller Script
// Patel Studio - 2026

const navLinks = document.querySelectorAll('.nav-link');
const contentRoot = document.getElementById('dynamic-content-root');

// Sidebar menu navigation rules
if (navLinks.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const feature = link.getAttribute('data-feature');
            if (feature === 'wishes') {
                window.loadAddWishesView();
            } else {
                contentRoot.innerHTML = `
                    <div style="padding: 20px; color:#fff;">
                        <h2>📋 ${feature.toUpperCase()} Panel</h2>
                        <p style="color:#94a3b8; margin-top:10px;">This section is under active development.</p>
                    </div>`;
            }
        });
    });
}

// Main Window view engine
window.loadAddWishesView = function() {
    if (!contentRoot) return;

    // HTML Layout Architecture
    contentRoot.innerHTML = `
        <div class="feature-box" style="padding: 20px; color: #fff;">
            <h2 style="margin-bottom: 20px;">➕ Add New Wish</h2>
            <form id="wishForm" style="display: flex; flex-direction: column; gap: 15px; max-width: 600px;">
                
                <div>
                    <label style="display:block; margin-bottom:5px; font-weight:bold;">Main Category:</label>
                    <select id="main-category" name="category" required style="width:100%; padding:10px; border-radius:5px; border:1px solid #334155; background:#1e293b; color:white;">
                        <option value="" disabled selected>Loading categories...</option>
                    </select>
                </div>

                <div>
                    <label style="display:block; margin-bottom:5px; font-weight:bold;">Sub Category:</label>
                    <select id="sub-category" name="sub_category" required disabled style="width:100%; padding:10px; border-radius:5px; border:1px solid #334155; background:#1e293b; color:white; opacity: 0.5;">
                        <option value="" disabled selected>Select Sub Category</option>
                    </select>
                </div>

                <div>
                    <label style="display:block; margin-bottom:5px; font-weight:bold;">Wish Title / Text:</label>
                    <textarea name="title" required placeholder="Enter your wish text here..." style="width:100%; padding:10px; border-radius:5px; border:1px solid #334155; background:#1e293b; color:white; min-height:120px; font-family:inherit;"></textarea>
                </div>

                <div>
                    <label style="display:block; margin-bottom:5px; font-weight:bold;">Upload Image (Optional):</label>
                    <input type="file" id="wish-image-file" name="image" accept="image/*" style="width:100%; background:#1e293b; padding:10px; border-radius:5px; border:1px solid #334155;">
                </div>

                <button type="submit" style="padding:12px; background:#4f46e5; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold; font-size:16px; margin-top:10px;">Submit Wish</button>
            </form>
            <p id="status-message" style="margin-top:15px; font-weight:bold; font-size:15px;"></p>
        </div>
    `;

    const mainCatSelect = document.getElementById('main-category');
    const subCatSelect = document.getElementById('sub-category');
    const wishForm = document.getElementById('wishForm');
    const statusDisplay = document.getElementById('status-message');

    // Safe lookup structure data parsing
    function getCategoriesData() {
        if (typeof window.categoriesConfig !== 'undefined') return window.categoriesConfig;
        if (typeof categoriesConfig !== 'undefined') return categoriesConfig;
        return null;
    }

    // Dynamic dropdown data options initialization
    function populateMainCategories() {
        const categories = getCategoriesData();
        
        if (!categories || Object.keys(categories).length === 0) {
            setTimeout(populateMainCategories, 80);
            return;
        }

        if (mainCatSelect) {
            mainCatSelect.innerHTML = '<option value="" disabled selected>Select Main Category</option>';
            Object.keys(categories).forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                mainCatSelect.appendChild(option);
            });
        }
    }

    populateMainCategories();

    // Mapping event rule for sub-categories tracking
    if (mainCatSelect && subCatSelect) {
        mainCatSelect.addEventListener('change', (e) => {
            const selectedMain = e.target.value;
            const categories = getCategoriesData() || {};
            const subCategories = categories[selectedMain] || [];

            subCatSelect.innerHTML = '<option value="" disabled selected>Select Sub Category</option>';

            if (subCategories.length > 0) {
                subCategories.forEach(sub => {
                    const option = document.createElement('option');
                    option.value = sub;
                    option.textContent = sub;
                    subCatSelect.appendChild(option);
                });
                subCatSelect.disabled = false;
                subCatSelect.style.opacity = "1";
            } else {
                subCatSelect.innerHTML = '<option value="" disabled selected>No Sub Categories</option>';
                subCatSelect.disabled = true;
                subCatSelect.style.opacity = "0.5";
            }
        });
    }

    // Form Submit unified handling mechanism
    if (wishForm) {
        wishForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            statusDisplay.innerText = "⏳ Processing and deploying payload...";
            statusDisplay.style.color = "#ffea00";
            
            const fileInput = document.getElementById('wish-image-file');
            let base64String = null;

            // Helper function to read file asynchronously safely
            const readImageAsBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (err) => reject(err);
                    reader.readAsDataURL(file);
                });
            };

            try {
                // Agar user ne koi image attach ki hai toh use encode karein
                if (fileInput && fileInput.files.length > 0) {
                    statusDisplay.innerText = "📸 Encoding media bytes...";
                    base64String = await readImageAsBase64(fileInput.files[0]);
                }

                statusDisplay.innerText = "🚀 Dispatching to server stream...";
                
                const payload = {
                    title: wishForm.elements['title'].value,
                    category: wishForm.elements['category'].value,
                    sub_category: wishForm.elements['sub_category'].value || '',
                    image: base64String // Sent directly inside the unified object payload
                };

                // 🚀 SINGLE UNIFIED ENDPOINT CALL (Bina dependencies breakdown ke)
                const response = await fetch('/api/add-wish-to-db', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const serverResult = await response.json();

                if (serverResult.success) {
                    statusDisplay.innerText = "✅ Wish successfully live!";
                    statusDisplay.style.color = "#00ff88";
                    wishForm.reset();
                    subCatSelect.disabled = true;
                    subCatSelect.style.opacity = "0.5";
                } else {
                    throw new Error(serverResult.message || "Execution dropped by backend engine.");
                }

            } catch (error) {
                statusDisplay.innerText = "🚨 Error: " + error.message;
                statusDisplay.style.color = "#ff4a4a";
            }
        });
    }
}

window.loadDefaultAdminView = function() {
    window.loadAddWishesView();
};
