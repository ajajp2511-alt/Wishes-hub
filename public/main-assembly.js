/**
 * Wishes-Hub: Main Assembly Engine
 */

// Imports
import initStorageManager from './features/storage-manager/storage-assembly.js';
import initDebugger from './features/debugger-manager/debug-assembly.js';
import initUiLayout from './features/ui-layout/ui-assembly.js';
import initPageManager from './features/page/page-assembly.js';
import initFeeders from './features/feeders/feeders-assembly.js';
import initShareManager from './features/share/share-assembly.js';
import initNotification from './features/notification-manager/notify-assembly.js';
import initInteraction from './features/interaction/interact-assembly.js';
import initAnalytics from './features/analytics/analytics-assembly.js';
import initUserProfile from './features/user-profile/profile-assembly.js';
import initOfflineManager from './features/offline-manager/offline-assembly.js';
import initWishOfTheDay from './features/wish-of-the-day/wish-assembly.js';

// Helper to keep the system running even if one module fails
async function runSafe(func, moduleName) {
    try {
        await func();
        console.log(`[System]: ${moduleName} loaded successfully.`);
    } catch (error) {
        console.error(`[System]: Failed to load ${moduleName}`, error);
    }
}

// Master Initialization Sequence
async function initAll() {
    console.group("Wishes-Hub System Start");

    // 1. Core Services (Dependencies first)
    await runSafe(initDebugger, "Debugger");
    await runSafe(initStorageManager, "StorageManager");
    await runSafe(initOfflineManager, "OfflineManager");

    // 2. UI & Foundation
    await runSafe(initUiLayout, "UiLayout");
    await runSafe(initPageManager, "PageManager");

    // 3. Features & Content
    await runSafe(initWishOfTheDay, "WishOfTheDay");
    await runSafe(initFeeders, "Feeders");
    await runSafe(initInteraction, "Interaction");
    await runSafe(initShareManager, "ShareManager");

    // 4. Intelligence & Personalization
    await runSafe(initAnalytics, "Analytics");
    await runSafe(initUserProfile, "UserProfile");
    await runSafe(initNotification, "Notification");

    console.groupEnd();
    console.log("Wishes-Hub: All systems operational.");
}

// Start the engine
initAll();
