import initDebugger from '/public/features/debugger-manager/debug-assembly.js';
import initStorageManager from '/public/features/storage-manager/storage-assembly.js';
import initThemeEngine from '/public/features/theme-engine/theme-assembly.js';
import initLocalization from '/public/features/localization-manager/lang-assembly.js';
import initCategories from '/public/features/categories-manager/categories-assembly.js';
import initWishesFeed from '/public/features/wishes-feed/wishes-assembly.js';
import initUiLayout from '/public/features/ui-layout/ui-assembly.js';

const Assembly = {
    initAll() {
        // 1. Sabse pehle Debugger taaki errors screen par dikhein
        initDebugger();
        
        console.log("Assembly: Starting Engine...");

        try {
            // 2. Core Services
            initStorageManager();
            initLocalization();
            initThemeEngine();
            
            // 3. Layout aur Content
            initUiLayout();
            initCategories();
            initWishesFeed();
            
            // 4. Success confirmation
            const grid = document.getElementById('wishes-grid');
            if (grid) {
                grid.innerHTML = "Engine Loaded Successfully!";
            }
            console.log("Assembly: All features initialized.");
        } catch (error) {
            console.error("Assembly: Critical error:", error);
            const grid = document.getElementById('wishes-grid');
            if (grid) {
                grid.innerHTML = "Engine Failed to Load. Check Console.";
            }
        }
    }
};

export default Assembly;
