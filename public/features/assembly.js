import initLocalization from './localization-manager/lang-assembly.js';
import initThemeEngine from './theme-engine/theme-assembly.js';
import initStorageManager from './storage-manager/storage-assembly.js';

const Assembly = {
    initAll() {
        initStorageManager(); // Storage sabse pehle load hona chahiye
        initLocalization();
        initThemeEngine();
    }
};

export default Assembly;
