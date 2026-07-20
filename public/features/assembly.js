import initDebugger from '/public/features/debugger-manager/debug-assembly.js';
import initStorageManager from '/public/features/storage-manager/storage-assembly.js';
import initThemeEngine from '/public/features/theme-engine/theme-assembly.js';
import initLocalization from '/public/features/localization-manager/lang-assembly.js';
import initCategories from '/public/features/categories-manager/categories-assembly.js';
import initWishesFeed from '/public/features/wishes-feed/wishes-assembly.js';
import initUiLayout from '/public/features/ui-layout/ui-assembly.js';

const Assembly = {
    async initAll() {
        console.log("Assembly: Starting Engine...");

        // Har module ko ek safe helper function mein run karenge
        const runSafe = async (fn, name) => {
            try {
                if (typeof fn === 'function') await fn();
                console.log(`Assembly: ${name} loaded.`);
            } catch (e) {
                console.error(`Assembly: Failed to load ${name}`, e);
            }
        };

        // Execution Sequence
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
