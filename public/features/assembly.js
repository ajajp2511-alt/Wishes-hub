import initStorageManager from './storage-manager/storage-assembly.js';
import initThemeEngine from './theme-engine/theme-assembly.js';
import initLocalization from './localization-manager/lang-assembly.js';
import initCategories from './categories-manager/categories-assembly.js';
import initWishesFeed from './wishes-feed/wishes-assembly.js'; // Naya import

const Assembly = {
    initAll() {
        console.log("Wishes-hub Engine Initializing...");

        initStorageManager();
        initLocalization();
        initThemeEngine();
        initCategories();
        initWishesFeed(); // Registering the feed

        console.log("Wishes-hub Engine Started Successfully.");
    }
};

export default Assembly;
