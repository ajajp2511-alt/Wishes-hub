// admin/script.js

// ... (Authentication Engine aur Initialization same rahenge) ...

// ==========================================
// 🛠️ DYNAMIC FEATURE LOADER (Final Modular Router)
// ==========================================
async function loadFeature(feature) {
    const contentRoot = document.getElementById("dynamic-content-root");
    if (!contentRoot) return;

    contentRoot.innerHTML = `<div class="loader">⚡ Initializing ${feature} module...</div>`;

    try {
        // Router Map: Har feature ke liye check karein
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
                // Ye naya module hai
                window.renderHealthModule ? window.renderHealthModule(contentRoot) : renderPlaceholder(contentRoot, "System Health", "health");
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
            <h3>${title} is under construction</h3>
            <p>Module logic: <code>/admin/features/${path}/${path}.js</code></p>
        </div>`;
}
