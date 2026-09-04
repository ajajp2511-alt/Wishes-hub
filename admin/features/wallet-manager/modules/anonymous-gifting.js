export function formatSenderDisplay(wishItem) {
    return wishItem.isAnonymous ? 'Secret Admirer (Anonymous)' : wishItem.sender;
}
