// Updated Wishes-hub: assembly.js
import initLocalization from './localization-manager/lang-assembly.js';
import initThemeEngine from './theme-engine/theme-assembly.js';

const Assembly = {
    initAll() {
        initLocalization();
        initThemeEngine(); // Naya feature added
    }
};

export default Assembly;
