// admin/script.js

// 🛡️ ROLE DEFINITIONS
const ROLES = {
    SUPER_ADMIN: { permissions: ['wishes', 'photos', 'links', 'manager', 'analytics', 'health', 'settings'] },
    EDITOR: { permissions: ['wishes', 'photos', 'links', 'manager'] },
    VIEWER: { permissions: ['analytics', 'health'] }
};

// ==========================================
// 🛡️ AUTHENTICATION & ROLE ENGINE
// ==========================================
function checkAuth() {
    const authStatus = localStorage.getItem("admin_auth_status");
    const loginMod = document.getElementById('login-module');
    const mainPan = document.getElementById('main-panel');

    if (authStatus === "active") {
        if (loginMod) loginMod.style.display = 'none';
        if (mainPan) mainPan.style.display = 'flex';
        return true;
    }
    return false;
}

window.logout = function() {
    localStorage.removeItem("admin_auth_status");
    localStorage.removeItem("admin_role");
    window.location.reload();
};

// ==========================================
// 🧭 NAVIGATION ROUTER WITH RBAC
// ==========================================
async function loadFeature(feature) {
    const contentRoot = document.getElementById("dynamic-content-root");
    if (!contentRoot) return;

    const userRole = localStorage.getItem("admin_role") || "VIEWER";
    const allowedFeatures = ROLES[userRole]?.permissions || [];

    // RBAC Security Check
    if (!allowedFeatures.includes(feature)) {
        contentRoot.innerHTML = `<div class="error-msg">🚫 Access Denied: You don't have permission to view "${feature}".</div>`;
        return;
    }

    contentRoot.innerHTML = `<div class="loader">⚡ Initializing ${feature} module...</div>`;

    try {
        switch (feature) {
            case "wishes": window.renderWishesModule?.(contentRoot) || renderPlaceholder(contentRoot, "Wishes", "wishes"); break;
            case "photos": window.renderPhotosModule?.(contentRoot) || renderPlaceholder(contentRoot, "Photos", "photos"); break;
            case "links": window.renderLinksModule?.(contentRoot) || renderPlaceholder(contentRoot, "Links", "links"); break;
            case "manager": window.renderManagerModule?.(contentRoot) || renderPlaceholder(contentRoot, "Manager", "manager"); break;
            case "analytics": window.renderAnalyticsModule?.(contentRoot) || renderPlaceholder(contentRoot, "Analytics", "analytics"); break;
            case "health": window.renderHealthModule?.(contentRoot) || renderPlaceholder(contentRoot, "System Health", "health"); break;
            case "settings": window.renderSettingsModule?.(contentRoot) || renderPlaceholder(contentRoot, "Settings", "settings"); break;
            default: contentRoot.innerHTML = `<div class="error-msg">⚠️ Module not found.</div>`;
        }
    } catch (err) {
        console.error("Router Error:", err);
        contentRoot.innerHTML = `<div class="error-msg">⚠️ System Error.</div>`;
    }
}

// 🚀 INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    if (checkAuth()) {
        const navLinks = document.querySelectorAll(".nav-link");
        const userRole = localStorage.getItem("admin_role") || "VIEWER";
        const allowedPermissions = ROLES[userRole].permissions;

        navLinks.forEach(link => {
            const feature = link.getAttribute("data-feature");
            
            // Hide restricted sidebar links
            if (feature !== 'auth' && !allowedPermissions.includes(feature)) {
                link.parentElement.style.display = 'none';
            }

            link.addEventListener("click", (e) => {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
                loadFeature(feature);
            });
        });

        // Load first available feature automatically
        const firstAvailable = allowedPermissions[0] || "analytics";
        loadFeature(firstAvailable);
    }

    document.getElementById('unlock-btn')?.addEventListener('click', window.verifyMasterPassword);
    document.getElementById('logout-btn')?.addEventListener('click', window.logout);
});

function renderPlaceholder(container, title, path) {
    container.innerHTML = `<div class="placeholder-card animate-fade"><h3>${title} Module</h3><p>Code pending in <code>/admin/features/${path}/${path}.js</code></p></div>`;
}
