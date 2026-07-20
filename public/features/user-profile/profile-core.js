import StorageCore from '../storage-manager/storage-core.js';

const ProfileCore = {
    init() {
        console.log("ProfileManager: User preferences initialized.");
    },

    savePreference(key, value) {
        const settings = StorageCore.getData('userSettings') || {};
        settings[key] = value;
        StorageCore.saveData('userSettings', settings);
        console.log(`Profile: ${key} updated to ${value}`);
    },

    getPreference(key) {
        const settings = StorageCore.getData('userSettings') || {};
        return settings[key] || null;
    }
};

export default ProfileCore;
