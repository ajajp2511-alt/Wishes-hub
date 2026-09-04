export function checkLockedWishTime(wishItem) {
    return wishItem.status.includes('Unlocked');
}
