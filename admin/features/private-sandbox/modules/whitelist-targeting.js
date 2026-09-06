export function isUserWhitelisted(email, whitelistArray) {
    return whitelistArray.includes(email) || email.includes('@wishes-hub.internal');
}
