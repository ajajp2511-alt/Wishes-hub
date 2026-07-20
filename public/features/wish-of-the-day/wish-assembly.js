// Path mein se /public/ hata diya gaya hai
import WishCore from '/features/wish-of-the-day/wish-core.js';

export default function initWishOfTheDay() {
    console.log("[System]: WishOfTheDay render ho raha hai...");
    
    if (typeof WishCore !== 'undefined' && typeof WishCore.render === 'function') {
        WishCore.render();
    } else {
        console.error("[System]: WishCore ya render function nahi mila!");
    }
}
