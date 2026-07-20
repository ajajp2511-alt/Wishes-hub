/**
 * Wishes-Hub: Main Assembly Engine
 * Updated for public/ folder structure
 */

// Imports with /public/ prefix
import initStorageManager from './public/features/storage-manager/storage-assembly.js';
import initDebugger from './public/features/debugger-manager/debug-assembly.js';
import initUiLayout from './public/features/ui-layout/ui-assembly.js';
import initPageManager from './public/features/page/page-assembly.js';
import initFeeders from './public/features/feeders/feeders-assembly.js';
import initShareManager from './public/features/share/share-assembly.js';
import initNotification from './public/features/notification-manager/notify-assembly.js';
import initInteraction from './public/features/interaction/interact-assembly.js';
import initAnalytics from './public/features/analytics/analytics-assembly.js';
import initUserProfile from './public/features/user-profile/profile-assembly.js';
import initOfflineManager from './public/features/offline-manager/offline-assembly.js';
import initWishOfTheDay from './public/features/wish-of-the-day/wish-assembly.js';

console.log("[Assembly]: File load ho gayi hai.");

async function runSafe(func, moduleName) {
    console.log(`[Assembly]: Trying to load -> ${moduleName}`);
    try {
        if (typeof func !== 'function') {
            throw new Error(`${moduleName} is not a function! Check your export.`);
        }
        await func();
        console.log(`[System]: ${moduleName} loaded successfully.`);
    } catch (error) {
        console.error(`[System]: FAILED to load ${moduleName}:`, error);
    }
}

const Assembly = {
    initAll: async function() {
        console.log("[Assembly]: initAll() function start ho gaya.");
        
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

        console.log("[Assembly]: Sabhi systems ka load process complete ho gaya.");
    }
};

export default Assembly;
