/* Features Assembly - Combines all user panel features with Safe Run */
import { initUserPanelUI } from './user-panel/panel-assembly.js';
import { initAdsManager } from './ads-manager/ads-assembly.js';
import { initDarkMode } from './dark-mode/dark-assembly.js';
import { initWishesRenderer } from './wishes-renderer/wishes-assembly.js';
import { initSearchFilter } from './search-filter/search-assembly.js';

export function initUserPanel() {
    console.log('Initializing User Panel & Modules...');
    
    // Safe run helper function
    const safeExecute = (moduleName, initFn) => {
        try {
            initFn();
        } catch (error) {
            console.error(`Error loading module [${moduleName}]:`, error);
        }
    };

    // 1. Render User Panel Professional Layout
    safeExecute('UserPanelUI', initUserPanelUI);

    // 2. Initialize Core Features Safely
    safeExecute('AdsManager', initAdsManager);
    safeExecute('DarkMode', initDarkMode);
    safeExecute('WishesRenderer', initWishesRenderer);
    safeExecute('SearchFilter', initSearchFilter);
    
    console.log('User Panel Fully Loaded Successfully.');
}

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initUserPanel();
});
