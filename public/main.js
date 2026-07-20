import initStorageManager from './features/storage-manager/storage-assembly.js';

const Assembly = {
    initAll: async function() {
        console.log("[System]: Initializing from main.js...");
        try {
            await initStorageManager();
            console.log("[System]: StorageManager loaded successfully!");
        } catch (error) {
            console.error("[System]: Failed to load StorageManager:", error);
        }
    }
};

export default Assembly;
