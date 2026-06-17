import { uploadToTelegram, saveToDatabase } from '../features/wishes/wish-api.js';

const navLinks = document.querySelectorAll('.nav-link');
const contentRoot = document.getElementById('dynamic-content-root');

// Safe function categoriesConfig data lene ke liye
function generateCategoryOptions() {
    const categories = window.categoriesConfig || {};
    return Object.keys(categories).map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

const addWishTemplate = `
    <div class="feature-box" style="padding: 20px; color: #fff;">
        <h2 style="margin-bottom: 20px;">➕ Add New Wish</h2>
        <form id="wishForm" style="display: flex; flex-direction: column; gap: 15px; max-width: 600px;">
            
            <div>
                <label style="display:block; margin-bottom:5px; font-weight:bold;">Main Category:</label>
                <select id="main-category" name="category" required style="width:100%; padding:10px; border-radius:5px; border:1px solid #334155; background:#1e293b; color:white;">
                    <option value="" disabled selected>Select Main Category</option>
                    ${generateCategoryOptions()}
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
                <input type="file" name="image" accept="image/*" style="width:100%; background:#1e293b; padding:10px; border-radius:5px; border:1px solid #334155;">
            </div>

            <button type="submit" style="padding:12px; background:#4f46e5; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold; font-size:16px; margin-top:10px;">Submit Wish</button>
        </form>
        <p id="status-message" style="margin-top:15px; font-weight:bold; font-size:15px;"></p>
    </div>
`;

// Sidebar click handler
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        const feature = link.getAttribute('data-feature');
        if (feature === 'wishes') {
            loadAddWishesView();
        } else {
            contentRoot.innerHTML = `
                <div style="padding: 20px; color:#fff;">
                    <h2>📋 ${feature.toUpperCase()} Panel</h2>
                    <p style="color:#94a3b8; margin-top:10px;">This section is under active development.</p>
                </div>`;
        }
    });
});

function loadAddWishesView() {
    contentRoot.innerHTML = addWishTemplate;

    const mainCatSelect = document.getElementById('main-category');
    const subCatSelect = document.getElementById('sub-category');
    const wishForm = document.getElementById('wishForm');
    const statusDisplay = document.getElementById('status-message');

    // Cascade dropdown listener
    if (mainCatSelect && subCatSelect) {
        mainCatSelect.addEventListener('change', (e) => {
            const selectedMain = e.target.value;
            const categories = window.categoriesConfig || {};
            const subCategories = categories[selectedMain] || [];

            if (subCategories.length > 0) {
                subCatSelect.innerHTML = `<option value="" disabled selected>Select Sub Category</option>` + 
                    subCategories.map(sub => `<option value="${sub}">${sub}</option>`).join('');
                subCatSelect.disabled = false;
                subCatSelect.style.opacity = "1";
            } else {
                subCatSelect.innerHTML = `<option value="" disabled selected>No Sub Categories</option>`;
                subCatSelect.disabled = true;
                subCatSelect.style.opacity = "0.5";
            }
        });
    }

    // Submit handler
    if (wishForm) {
        wishForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            statusDisplay.innerText = "⏳ Uploading to Telegram...";
            statusDisplay.style.color = "#ffea00";
            
            const formData = new FormData(wishForm);
            try {
                const tgData = await uploadToTelegram(formData);
                if (!tgData.success) throw new Error("Telegram Upload failed!");
                
                statusDisplay.innerText = "💾 Saving to Database...";
                const dbData = await saveToDatabase({
                    title: formData.get('title'),
                    category: formData.get('category'),
                    sub_category: formData.get('sub_category'),
                    tgData: tgData
                });
                
                if (dbData.success) {
                    statusDisplay.innerText = "✅ Wish successfully live!";
                    statusDisplay.style.color = "#00ff88";
                    wishForm.reset();
                    subCatSelect.disabled = true;
                    subCatSelect.style.opacity = "0.5";
                } else {
                    throw new Error(dbData.error || "Database operation failed");
                }
            } catch (error) {
                statusDisplay.innerText = "🚨 Error: " + error.message;
                statusDisplay.style.color = "#ff4a4a";
            }
        });
    }
}

// Default state trigger
document.addEventListener('DOMContentLoaded', () => {
    // Agar portal pehle se open ho ya content khaali ho
    if (contentRoot && contentRoot.innerHTML.trim() === "") {
        loadAddWishesView();
    }
});

// Global internal window trigger jab password unlock ho jaye tab automatically view load karne ke liye
window.loadDefaultAdminView = function() {
    loadAddWishesView();
};
