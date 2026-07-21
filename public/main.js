// Sirf storage assembly ko import karein
import initStorageManager from './features/storage/storage-assembly.js';

async function runSafe(func, moduleName) {
    try {
        await func();
        console.log(`[System]: ${moduleName} loaded successfully.`);
    } catch (error) {
        console.error(`[System]: Failed to load ${moduleName}:`, error);
    }
}

const Assembly = {
    initAll: async function() {
        console.log("[System]: Initializing single feature...");
        
        // Sirf StorageManager ko run karein
        await runSafe(initStorageManager, "StorageManager");
        
        console.log("Wishes-Hub: Test operational.");
    }
};

export default Assembly;
