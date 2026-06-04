// admin/script.js

// ==========================================
// 🛡️ AUTHENTICATION ENGINE
// ==========================================
function checkAuth() {
    const authStatus = localStorage.getItem("admin_auth_status");
    const loginMod = document.getElementById('login-module');
    const mainPan = document.getElementById('main-panel');

    if (authStatus === "active") {
        if (loginMod) loginMod.style.display = 'none';
        if (mainPan) mainPan.style.display = 'flex'; // Mobile/Desktop Flex Layout
        return true;
    } else {
        if (loginMod) loginMod.style.display = 'block';
        if (mainPan) mainPan.style.display = 'none';
        return false;
    }
}

window.logout = function() {
    localStorage.removeItem("admin_auth_status");
    window.location.reload();
};

// ==========================================
// 🚀 INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const isAuthenticated = checkAuth();

    // Bind Auth Buttons
    const unlockBtn = document.getElementById('unlock-btn');
    if (unlockBtn) unlockBtn.addEventListener('click', window.verifyMasterPassword);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', window.logout);

    if (isAuthenticated) {
        initializeDashboardNavigation();
    }
});

// ==========================================
// 🧭 NAVIGATION ROUTER
// ==========================================
function initializeDashboardNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    
    // Sabse pehle Default Feature (Wishes) load karein
    loadFeature("wishes");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const featureName = link.getAttribute("data-feature");
            
            if (featureName === "auth") {
                window.logout();
                return;
            }
            
            // UI Active Tab Toggle
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            loadFeature(featureName);
        });
    });
}

// ==========================================
// 🛠️ DYNAMIC FEATURE LOADER (Modular)
// ==========================================
async function loadFeature(feature) {
    const contentRoot = document.getElementById("dynamic-content-root");
    if (!contentRoot) return;

    // Loading State
    contentRoot.innerHTML = `<div class="loader">⚡ Loading ${feature} Module...</div>`;

    try {
        // Har feature apni alag file se function call karega
        switch (feature) {
            case "wishes":
                if (typeof window.renderWishesModule === "function") {
                    window.renderWishesModule(contentRoot);
                }
                break;

            case "photos":
                if (typeof window.renderPhotosModule === "function") {
                    window.renderPhotosModule(contentRoot);
                }
                break;

            case "links":
                if (typeof window.renderLinksModule === "function") {
                    window.renderLinksModule(contentRoot);
                }
                break;

            case "manager":
                // Agar manager file ready nahi hai toh placeholder dikhayega
                if (typeof window.renderManagerModule === "function") {
                    window.renderManagerModule(contentRoot);
                } else {
                    renderPlaceholder(contentRoot, "Manage Wishes", "manager");
                }
                break;

            case "analytics":
                renderPlaceholder(contentRoot, "System Analytics", "analytics");
                break;

            default:
                contentRoot.innerHTML = `<div class="error">Module Not Found</div>`;
        }
    } catch (err) {
        console.error("Router Error:", err);
        contentRoot.innerHTML = `<div class="error-msg">⚠️ Failed to load ${feature}. Check console for errors.</div>`;
    }
}

// Global Placeholder for pending features
function renderPlaceholder(container, title, path) {
    container.innerHTML = `
        <div class="placeholder-card animate-fade">
            <div class="icon" style="font-size: 3rem; margin-bottom: 1rem;">⚙️</div>
            <h3>${title} Module</h3>
            <p>Code logic is isolated inside <code>/admin/features/${path}/${path}.js</code></p>
            <p style="margin-top: 1rem; color: var(--text-muted);">Please create the module file to activate this section.</p>
        </div>`;
}
