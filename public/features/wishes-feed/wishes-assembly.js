import WishesCore from './wishes-core.js';

export default async function initWishesFeed() {
    console.log("Wishes-Feed: Initializing...");
    await WishesCore.loadWishes();
}
