import StorageCore from '../storage-manager/storage-core.js';

const InteractCore = {
    init() {
        console.log("Interaction: System Active.");
    },

    registerReaction(wishId, reactionType) {
        // reactionType: 'like' ya 'dislike'
        let interactions = StorageCore.getData('userInteractions') || {};
        
        // WishId ko track karna
        interactions[wishId] = reactionType;
        
        StorageCore.saveData('userInteractions', interactions);
        console.log(`Interaction: Wish ${wishId} marked as ${reactionType}`);
    }
};

export default InteractCore;
