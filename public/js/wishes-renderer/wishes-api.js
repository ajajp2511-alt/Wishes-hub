/* Wishes API Service */
import { WishesConfig } from './wishes-config.js';

export async function fetchWishesData() {
    const response = await fetch(WishesConfig.apiEndpoint);
    const data = await response.json();

    if (!data.success) {
        throw new Error(data.message || "Server error occurred.");
    }

    return data.wishes || [];
}
