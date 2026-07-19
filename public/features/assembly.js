import initStorageManager from './storage-manager/storage-assembly.js';
import initThemeEngine from './theme-engine/theme-assembly.js';
import initLocalization from './localization-manager/lang-assembly.js';
import initCategories from './categories-manager/categories-assembly.js';
import initWishesFeed from './wishes-feed/wishes-assembly.js';
import initUiLayout from './ui-layout/ui-assembly.js'; // Naya Import

const Assembly = {
    initAll() {
        initStorageManager();
        initLocalization();
        initThemeEngine();
        initUiLayout(); // Sabse pehle UI load karein
        initCategories();
        initWishesFeed();
    }
};
export default Assembly;
