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

// Global Event Delegation Setup (Prevents broken listeners on re-renders)
if (contentRoot) {
    // 1. Dynamic Dropdown Change Handler
    contentRoot.addEventListener('change', (e) => {
        if (e.target && e.target.id === 'main-category') {
            const subCatSelect = document.getElementById('sub-category');
            if (!subCatSelect) return;

            const selectedMain = e.target.value;
            const categories = window.loadAddWishesView.getCategoriesData() || {};
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
        }
    });

    // 2. Dynamic Form Submit Handler
    contentRoot.addEventListener('submit', async (e) => {
        if (e.target && e.target.id === 'wishForm') {
            e.preventDefault();
            const wishForm = e.target;
            const statusDisplay = document.getElementById('status-message');
            const subCatSelect = document.getElementById('sub-category');
            
            if (!statusDisplay) return;

            statusDisplay.innerText = "⏳ Processing and deploying payload...";
            statusDisplay.style.color = "#ffea00";
            
            const fileInput = document.getElementById('wish-image-file');
            let base64String = null;

            const resizeAndCompressImage = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (event) => {
                        const img = new Image();
                        img.src = event.target.result;
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            let width = img.width;
                            let height = img.height;

                            const MAX_WIDTH = 1200;
                            if (width > MAX_WIDTH) {
                                height = Math.round((height * MAX_WIDTH) / width);
                                width = MAX_WIDTH;
                            }

                            canvas.width = width;
                            canvas.height = height;
                            
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);

                            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                            resolve(compressedBase64);
                        };
                        img.onerror = (err) => reject(err);
                    };
                    reader.onerror = (err) => reject(err);
                });
            };

            try {
                if (fileInput && fileInput.files.length > 0) {
                    statusDisplay.innerText = "⚡ Auto-Compressing Image to Secure Network Limits...";
                    const originalFile = fileInput.files[0];
                    
                    if (originalFile.type.includes('gif')) {
                        const readGif = (file) => new Promise((res, rej) => {
                            const r = new FileReader(); r.onload = () => res(r.result); r.onerror = ev => rej(ev); r.readAsDataURL(file);
                        });
                        base64String = await readGif(originalFile);
                    } else {
                        base64String = await resizeAndCompressImage(originalFile);
                    }
                }

                statusDisplay.innerText = "🚀 Synchronizing with Global Servers...";
                
                // FIXED DATA EXTRACTION METHOD
                const payload = {
                    title: wishForm.querySelector('textarea[name="title"]').value,
                    category: document.getElementById('main-category').value,
                    sub_category: document.getElementById('sub-category').value || '',
                    image: base64String 
                };

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
                    if (subCatSelect) {
                        subCatSelect.disabled = true;
                        subCatSelect.style.opacity = "0.5";
                        subCatSelect.innerHTML = '<option value="" disabled selected>Select Sub Category</option>';
                    }
                } else {
                    throw new Error(serverResult.message || "Execution dropped by backend engine.");
                }

            } catch (error) {
                statusDisplay.innerText = "🚨 Error: " + error.message;
                statusDisplay.style.color = "#ff4a4a";
            }
        }
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

    function populateMainCategories() {
        const mainCatSelect = document.getElementById('main-category');
        const categories = window.loadAddWishesView.getCategoriesData();
        
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
};

// Helper inside function namespace to keep global scope clean
window.loadAddWishesView.getCategoriesData = function() {
    if (typeof window.categoriesConfig !== 'undefined') return window.categoriesConfig;
    if (typeof categoriesConfig !== 'undefined') return categoriesConfig;
    return null;
};

window.loadDefaultAdminView = function() {
    window.loadAddWishesView();
};
