// Wishes-hub: Storage Core
const StorageCore = {
    set(key, value) {
        localStorage.setItem(`wishes-hub-${key}`, JSON.stringify(value));
    },

    get(key) {
        const data = localStorage.getItem(`wishes-hub-${key}`);
        return data ? JSON.parse(data) : null;
    },

    remove(key) {
        localStorage.removeItem(`wishes-hub-${key}`);
    }
};

export default StorageCore;
