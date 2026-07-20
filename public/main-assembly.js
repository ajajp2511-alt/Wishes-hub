// Import sirf ek feature ka
import initStorageManager from '../features/storage-manager/storage-assembly.js';

const Assembly = {
    initAll: async function() {
        console.log("[Assembly]: Testing mode - Loading StorageManager only...");
        
        try {
            // StorageManager ko run aur test kar rahe hain
            await initStorageManager();
            console.log("[System]: StorageManager successfully loaded!");
        } catch (error) {
            console.error("[System]: FAILED to load StorageManager:", error);
        }
    }
};

export default Assembly;
