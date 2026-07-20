// Sirf ek import rakhein test karne ke liye
import initStorageManager from './features/storage-manager/storage-assembly.js';

async function runSafe(func, moduleName) {
    try {
        await func();
        console.log(`[System]: ${moduleName} loaded successfully.`);
    } catch (error) {
        console.error(`[System]: Failed to load ${moduleName}:`, error);
    }
}

// Sirf ek module ko run karein
const Assembly = {
    initAll: async function() {
        console.log("[System]: Initializing single module...");
        await runSafe(initStorageManager, "StorageManager");
        console.log("Wishes-Hub: Test operational.");
    }
};

Assembly.initAll();
