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
        if (mainPan) mainPan.style.display = 'flex';
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
    
    // Default load: Wishes
    loadFeature("wishes");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const featureName = link.getAttribute("data-feature");
            
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

    contentRoot.innerHTML = `<div class="loader">⚡ Initializing ${feature} module...</div>`;

    try {
        switch (feature) {
            case "wishes":
                window.renderWishesModule ? window.renderWishesModule(contentRoot) : renderPlaceholder(contentRoot, "Wishes", "wishes");
                break;
            case "photos":
                window.renderPhotosModule ? window.renderPhotosModule(contentRoot) : renderPlaceholder(contentRoot, "Photos", "photos");
                break;
            case "links":
                window.renderLinksModule ? window.renderLinksModule(contentRoot) : renderPlaceholder(contentRoot, "Links", "links");
                break;
            case "manager":
                window.renderManagerModule ? window.renderManagerModule(contentRoot) : renderPlaceholder(contentRoot, "Manager", "manager");
                break;
            case "analytics":
                window.renderAnalyticsModule ? window.renderAnalyticsModule(contentRoot) : renderPlaceholder(contentRoot, "Analytics", "analytics");
                break;
            case "health":
                window.renderHealthModule ? window.renderHealthModule(contentRoot) : renderPlaceholder(contentRoot, "System Health", "health");
                break;
            case "settings":
                window.renderSettingsModule ? window.renderSettingsModule(contentRoot) : renderPlaceholder(contentRoot, "Settings", "settings");
                break;
            default:
                contentRoot.innerHTML = `<div class="error-msg">⚠️ Feature "${feature}" is not configured.</div>`;
        }
    } catch (err) {
        console.error("Router Error:", err);
        contentRoot.innerHTML = `<div class="error-msg">⚠️ System Error: Failed to load ${feature}.</div>`;
    }
}

// Global Placeholder
function renderPlaceholder(container, title, path) {
    container.innerHTML = `
        <div class="placeholder-card animate-fade">
            <div class="icon" style="font-size: 3rem; margin-bottom: 1rem;">🏗️</div>
            <h3>${title} Module</h3>
            <p>Code logic is pending in <code>/admin/features/${path}/${path}.js</code></p>
        </div>`;
}
