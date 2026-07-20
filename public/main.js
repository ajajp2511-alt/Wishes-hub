// Path update karke ./ kar dein
import initStorageManager from './features/storage-manager/storage-assembly.js';

const Assembly = {
    initAll: async function() {
        console.log("[Assembly]: Initializing...");
        try {
            await initStorageManager();
            console.log("[System]: StorageManager loaded!");
        } catch (error) {
            console.error("[System]: Error:", error);
        }
    }
};

export default Assembly;
