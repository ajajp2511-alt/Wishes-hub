// public/features/assembly.js
import initDebugger from '/public/features/debugger-manager/debug-assembly.js';
import initStorageManager from '/public/features/storage-manager/storage-assembly.js';
import initThemeEngine from '/public/features/theme-engine/theme-assembly.js';
import initLocalization from '/public/features/localization-manager/lang-assembly.js';
import initCategories from '/public/features/categories-manager/categories-assembly.js';
import initWishesFeed from '/public/features/wishes-feed/wishes-assembly.js';
import initUiLayout from '/public/features/ui-layout/ui-assembly.js';

const Assembly = {
    async initAll() {
        // 1. Sabse pehle Debugger taaki errors screen par dikhein
        initDebugger();
        
        console.log("Assembly: Starting Engine...");

        try {
            // 2. Core Services
            initStorageManager();
            initLocalization();
            initThemeEngine();
            
            // 3. UI aur Layout
            initUiLayout();
            initCategories();
            
            // 4. Content Loading (Wishes Feed)
            // Hum yahan await use kar rahe hain taaki pehle wishes load ho jayein
            await initWishesFeed();
            
            // 5. Success Logic
            console.log("Assembly: All features initialized successfully.");
            
            // Grid ko update karne ki zaroorat nahi hai agar initWishesFeed 
            // khud data render kar raha hai. 
            // Agar aap confirm karna chahte hain toh bas console mein dekhein.
            
        } catch (error) {
            console.error("Assembly: Critical error during initialization:", error);
            
            const grid = document.getElementById('wishes-grid');
            if (grid) {
                grid.innerHTML = "Engine Failed to Load. Check Console for details.";
            }
        }
    }
};

export default Assembly;
