export function checkUnclaimedRefund(wishItem, daysPassed) {
    if (daysPassed >= 7 && wishItem.status.includes('Escrow')) {
        wishItem.status = 'Refunded to Sender';
        return true;
    }
    return false;
}
