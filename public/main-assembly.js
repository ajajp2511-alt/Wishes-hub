// Path mein ../ ka use karein taaki public folder se bahar nikal kar features folder mil sake
import initStorageManager from '../features/storage-manager/storage-assembly.js';
import initDebugger from '../features/debugger-manager/debug-assembly.js';
import initUiLayout from '../features/ui-layout/ui-assembly.js';
import initPageManager from '../features/page/page-assembly.js';
import initFeeders from '../features/feeders/feeders-assembly.js';
import initShareManager from '../features/share/share-assembly.js';
import initNotification from '../features/notification-manager/notify-assembly.js';
import initInteraction from '../features/interaction/interact-assembly.js';
import initAnalytics from '../features/analytics/analytics-assembly.js';
import initUserProfile from '../features/user-profile/profile-assembly.js';
import initOfflineManager from '../features/offline-manager/offline-assembly.js';
import initWishOfTheDay from '../features/wish-of-the-day/wish-assembly.js';

async function runSafe(func, moduleName) {
    try {
        await func();
        console.log(`[System]: ${moduleName} loaded.`);
    } catch (error) {
        console.error(`[System]: Failed to load ${moduleName}:`, error);
    }
}

const Assembly = {
    initAll: async function() {
        await runSafe(initDebugger, "Debugger");
        await runSafe(initStorageManager, "StorageManager");
        await runSafe(initOfflineManager, "OfflineManager");
        await runSafe(initUiLayout, "UiLayout");
        await runSafe(initPageManager, "PageManager");
        await runSafe(initWishOfTheDay, "WishOfTheDay");
        await runSafe(initFeeders, "Feeders");
        await runSafe(initInteraction, "Interaction");
        await runSafe(initShareManager, "ShareManager");
        await runSafe(initAnalytics, "Analytics");
        await runSafe(initUserProfile, "UserProfile");
        await runSafe(initNotification, "Notification");
        console.log("Wishes-Hub: All systems operational.");
    }
};

export default Assembly;
