/* Menu Navigation Assembly */
import { MenuCore } from './menu-core.js';

export async function initMenuNavigation() {
    console.log("🚀 Menu Navigation: Initializing...");

    try {
        // 1. Render Menu Side Drawer Logic
        const menuEngine = new MenuCore();
        menuEngine.renderMenu();

        // 2. Select Elements
        const toggleBtn = document.getElementById('menu-toggle-btn');
        const menuContainer = document.getElementById('menu-navigation-container');

        if (toggleBtn && menuContainer) {
            // Hamburger click par menu active toggle hoga
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menuContainer.classList.toggle('active');
                console.log("🍔 Menu Drawer Toggled!");
            });

            // Outside click par menu auto-close hoga
            document.addEventListener('click', (e) => {
                if (menuContainer.classList.contains('active') &&
                    !menuContainer.contains(e.target) &&
                    !toggleBtn.contains(e.target)) {
                    menuContainer.classList.remove('active');
                    console.log("🔒 Menu Closed (Outside Click)");
                }
            });
        } else {
            console.warn("⚠️ Menu toggle button ya container DOM mein nahi mila.");
        }

        console.log("✅ Menu Navigation: Online");
        return true;

    } catch (err) {
        console.error("❌ Menu Navigation Initialization Failed:", err);
        throw err;
    }
}
