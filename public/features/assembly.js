// Wishes-hub: Central Assembly Engine
import initStorageManager from './storage-manager/storage-assembly.js';
import initThemeEngine from './theme-engine/theme-assembly.js';
import initLocalization from './localization-manager/lang-assembly.js';
import initCategories from './categories-manager/categories-assembly.js';

const Assembly = {
    /**
     * Saare features ko initialize karta hai
     */
    initAll() {
        console.log("Wishes-hub Engine Initializing...");

        // 1. Storage Manager (Sabse pehle load hona chahiye)
        initStorageManager();

        // 2. Localization Manager
        initLocalization();

        // 3. Theme Engine
        initThemeEngine();

        // 4. Categories Manager (Upcoming Festivals)
        initCategories();

        console.log("Wishes-hub Engine Started Successfully.");
    }
};

export default Assembly;
