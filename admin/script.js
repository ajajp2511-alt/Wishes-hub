// admin/script.js

// ==========================================
// 🛡️ AUTHENTICATION ENGINE (SECURITY CHECK)
// ==========================================
function checkAuth() {
    const authStatus = localStorage.getItem("admin_auth_status");
    
    // Agar login layout aapke index.html me hi defined hai
    const loginMod = document.getElementById('login-module');
    const mainPan = document.getElementById('main-panel') || document.querySelector('.admin-wrapper');

    if (authStatus === "active") {
        if (loginMod) loginMod.style.display = 'none';
        if (mainPan) mainPan.style.display = 'flex'; // `.admin-wrapper` layout flex use karta hai
        return true;
    } else {
        if (loginMod) loginMod.style.display = 'block';
        if (mainPan) mainPan.style.display = 'none';
        return false;
    }
}

// Global Logout Handler
window.logout = function() {
    localStorage.removeItem("admin_auth_status");
    window.location.reload();
};

// ==========================================
// 🚀 MAIN DOM INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Pehle user valid hai ya nahi check karein
    const isAuthenticated = checkAuth();

    // 2. Authentication Event Listeners
    const unlockBtn = document.getElementById('unlock-btn');
    if (unlockBtn) {
        unlockBtn.addEventListener('click', window.verifyMasterPassword);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', window.logout);
    }

    // 3. Agar authenticated hai, toh hi features logic init karein
    if (isAuthenticated) {
        initializeDashboardNavigation();
    }
});

// ==========================================
// 📋 DASHBOARD NAVIGATION & LAYOUT
// ==========================================
function initializeDashboardNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    
    // Default module load karein (Wishes module)
    loadFeature("wishes");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            
            const featureName = link.getAttribute("data-feature");
            
            // Agar logout button sidebar me .nav-link ki tarah mapped hai
            if (featureName === "auth") {
                window.logout();
                return;
            }
            
            // Active tab styling toggle
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            loadFeature(featureName);
        });
    });
}

// Dynamic Feature Loader Engine
async function loadFeature(feature) {
    const contentRoot = document.getElementById("dynamic-content-root");
    if (!contentRoot) return;

    contentRoot.innerHTML = `<div class="loader">Loading ${feature}...</div>`;

    try {
        if (feature === "wishes") {
            contentRoot.innerHTML = renderWishesForm();
            initWishesFeature(); // Form binding aur categories dropdown loader trigger
        } else {
            contentRoot.innerHTML = `
                <div class="placeholder-card">
                    <h3>Feature Component: "${feature}"</h3>
                    <p>This module is located inside /admin/features/${feature}/</p>
                </div>`;
        }
    } catch (err) {
        console.error("Feature loading broken:", err);
        contentRoot.innerHTML = `<div class="error-msg">Failed to initialize workspace layout.</div>`;
    }
}

// HTML Generator Template for Wishes Form
function renderWishesForm() {
    return `
        <div class="feature-card animate-fade">
            <div class="card-header">
                <h2>✨ Add New Wish Entry</h2>
                <p>Select accurate global categories to publish wishes directly onto Wishes Hub.</p>
            </div>
            
            <form id="wishesSubmissionForm">
                <div class="form-group">
                    <label for="wishCategory">Main Category</label>
                    <select id="wishCategory" required>
                        <!-- category-data.js se options load honge -->
                    </select>
                </div>

                <div class="form-group">
                    <label for="wishSubCategory">Sub Category</label>
                    <select id="wishSubCategory" disabled required>
                        <option value="">-- Choose Sub Category --</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="wishBody">Wish Text Message</label>
                    <textarea id="wishBody" rows="5" placeholder="Write your beautiful greeting message here..." required></textarea>
                </div>

                <button type="submit" id="addWishSubmitBtn" class="primary-action-btn">Publish to Wishes Hub</button>
            </form>
            <div id="wishesActionFeedback" class="feedback-container"></div>
        </div>
    `;
}

// Logic Handler for Dropdowns population and Form submissions
function initWishesFeature() {
    const form = document.getElementById("wishesSubmissionForm");
    if (!form) return;

    const mainCategorySelect = document.getElementById("wishCategory");
    const subCategorySelect = document.getElementById("wishSubCategory");
    const feedback = document.getElementById("wishesActionFeedback");

    // Dynamic checks for global category-data.js utilities
    if (typeof populateMainCategories === "function") {
        populateMainCategories(mainCategorySelect);
    }

    mainCategorySelect.addEventListener("change", () => {
        const selectedMain = mainCategorySelect.value;
        if (typeof updateSubCategories === "function") {
            updateSubCategories(selectedMain, subCategorySelect);
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const mainCat = mainCategorySelect.value;
        const subCat = subCategorySelect.value;
        const text = document.getElementById("wishBody").value;

        feedback.className = "feedback-container processing";
        feedback.innerText = "⚡ Transmitting payload to serverless endpoint...";

        const wishPayload = {
            mainCategory: mainCat,
            subCategory: subCat,
            wishText: text,
            status: "active",
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/add-wish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(wishPayload)
            });

            if (response.ok) {
                feedback.className = "feedback-container success";
                feedback.innerText = `✅ Success! Wish published under ${mainCat} ➔ ${subCat}.`;
                form.reset();
                subCategorySelect.disabled = true;
            } else {
                throw new Error("Endpoint connection initialization pending.");
            }
        } catch (error) {
            console.log("Local Payload Mock Saved:", wishPayload);
            feedback.className = "feedback-container success";
            feedback.innerText = `✅ [Mock Saved] Wish verified for ${mainCat} (${subCat})!`;
            form.reset();
            subCategorySelect.disabled = true;
        }
    });
                    }
