import initDebugger from './debugger-manager/debug-assembly.js';
import initStorageManager from './storage-manager/storage-assembly.js';
import initThemeEngine from './theme-engine/theme-assembly.js';
import initLocalization from './localization-manager/lang-assembly.js';
import initCategories from './categories-manager/categories-assembly.js';
import initWishesFeed from './wishes-feed/wishes-assembly.js';
import initUiLayout from './ui-layout/ui-assembly.js';

const Assembly = {
    async initAll() {
        console.log("Assembly: Starting Engine...");

        const runSafe = async (fn, name) => {
            try {
                if (typeof fn === 'function') await fn();
                console.log(`Assembly: ${name} loaded.`);
            } catch (e) {
                console.error(`Assembly: Failed to load ${name}`, e);
            }
        };

        await runSafe(initDebugger, "Debugger");
        await runSafe(initStorageManager, "StorageManager");
        await runSafe(initLocalization, "Localization");
        await runSafe(initThemeEngine, "ThemeEngine");
        await runSafe(initUiLayout, "UiLayout");
        await runSafe(initCategories, "Categories");
        await runSafe(initWishesFeed, "WishesFeed");

        console.log("Assembly: Engine Boot Sequence Complete.");
    }
};

export default Assembly;
