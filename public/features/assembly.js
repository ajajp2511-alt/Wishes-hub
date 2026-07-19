import initDebugger from '/public/features/debugger-manager/debug-assembly.js';
import initStorageManager from '/public/features/storage-manager/storage-assembly.js';
import initThemeEngine from '/public/features/theme-engine/theme-assembly.js';
import initLocalization from '/public/features/localization-manager/lang-assembly.js';
import initCategories from '/public/features/categories-manager/categories-assembly.js';
import initWishesFeed from '/public/features/wishes-feed/wishes-assembly.js';
import initUiLayout from '/public/features/ui-layout/ui-assembly.js';

const Assembly = {
    async initAll() {
        initDebugger();
        console.log("Assembly: Starting Engine...");

        try {
            initStorageManager();
            initLocalization();
            initThemeEngine();
            initUiLayout();
            initCategories();
            
            // Sabse zaroori: Wishes load hone tak wait karein
            await initWishesFeed();
            
            console.log("Assembly: All features initialized successfully.");
        } catch (error) {
            console.error("Assembly: Critical error during initialization:", error);
            const grid = document.getElementById('wishes-grid');
            if (grid) {
                grid.innerHTML = "Engine Failed to Load. Check Console.";
            }
        }
    }
};

export default Assembly;
