// Wishes-hub: Central Assembly Engine
import initDebugger from './debugger-manager/debug-assembly.js';
import initStorageManager from './storage-manager/storage-assembly.js';
import initThemeEngine from './theme-engine/theme-assembly.js';
import initLocalization from './localization-manager/lang-assembly.js';
import initCategories from './categories-manager/categories-assembly.js';
import initWishesFeed from './wishes-feed/wishes-assembly.js';
import initUiLayout from './ui-layout/ui-assembly.js';

const Assembly = {
    /**
     * Saare features ko initialize karta hai
     */
    initAll() {
        // Sabse pehle debugger start karein taaki errors dikh sakein
        initDebugger();
        
        console.log("Assembly: Initializing Engine...");

        try {
            // 1. Core Services
            initStorageManager();
            initLocalization();
            initThemeEngine();
            
            // 2. UI Layout
            initUiLayout();
            
            // 3. Page Content
            initCategories();
            initWishesFeed();
            
            console.log("Assembly: All features loaded successfully.");
        } catch (error) {
            console.error("Assembly: Critical error during initialization:", error);
        }
    }
};

export default Assembly;
