// public/features/wishes-feed/wishes-assembly.js
import WishesCore from './wishes-core.js';

export default async function initWishesFeed() {
    console.log("Wishes-Feed: Initializing...");
    try {
        // Humne yahan await lagaya hai taaki data load hone ka wait ho
        await WishesCore.loadWishes();
        console.log("Wishes-Feed: Loaded successfully.");
    } catch (err) {
        console.error("Wishes-Feed: Failed to load", err);
    }
}
