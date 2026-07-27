/* Menu Navigation Assembly */
import { MenuCore } from './menu-core.js';

export async function initMenuNavigation() {
    console.log("Menu Navigation: Initializing...");
    const menuEngine = new MenuCore();
    menuEngine.renderMenu();
    console.log("Menu Navigation: Online");
}

// Auto-run when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenuNavigation);
} else {
    initMenuNavigation();
}
