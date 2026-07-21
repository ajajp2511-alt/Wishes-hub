/* Features Assembly - Direct Connection for Wishes Renderer */
import { initUserPanelUI } from './user-panel/panel-assembly.js';
import { initAdsManager } from './ads-manager/ads-assembly.js';
import { initDarkMode } from './dark-mode/dark-assembly.js';
import { initWishesRenderer } from './wishes-renderer/wishes-assembly.js';
import { initSearchFilter } from './search-filter/search-assembly.js';

export function initUserPanel() {
    console.log('Initializing User Panel & Modules...');
    
    const safeExecute = (moduleName, initFn) => {
        try {
            initFn();
        } catch (error) {
            console.error(`Error loading module [${moduleName}]:`, error);
        }
    };

    // 1. Render UI Components
    safeExecute('UserPanelUI', initUserPanelUI);

    // 2. Initialize Core Features & Directly Connect Wishes Renderer
    safeExecute('AdsManager', initAdsManager);
    safeExecute('DarkMode', initDarkMode);
    safeExecute('WishesRenderer', initWishesRenderer); // Direct connection to fetch and render wishes
    safeExecute('SearchFilter', initSearchFilter);
    
    console.log('User Panel Fully Loaded Successfully.');
}

document.addEventListener('DOMContentLoaded', () => {
    initUserPanel();
});
