import StorageCore from '../storage-manager/storage-core.js';

const FeedersCore = {
    init() {
        console.log("Feeders: Initializing feed streams...");
    },

    // Ye function filter karke data return karega
    getFeed(type) {
        const allWishes = StorageCore.getData('wishes') || [];
        
        switch(type) {
            case 'trending':
                return allWishes.filter(w => w.isTrending);
            case 'latest':
                return allWishes.slice(-5); // Last 5 added
            default:
                return allWishes;
        }
    }
};

export default FeedersCore;
