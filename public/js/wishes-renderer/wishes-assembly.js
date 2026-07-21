/* Wishes Renderer Assembly */
import { WishesCore } from './wishes-core.js';

export function initWishesRenderer() {
    const wishesModule = new WishesCore();
    console.log('Wishes Renderer Module Loaded Successfully.');
    return wishesModule;
}
