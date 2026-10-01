/**
 * Login - Account Merging Sub-Module
 * Automatically merges social identities (Google/Telegram) if email matches an existing account.
 */

export class LoginAccountMerge {
    static async mergeIdentities(existingUser, newIdentityProviderData) {
        try {
            if (!existingUser || !newIdentityProviderData) return existingUser;

            // Link secondary provider data to primary user profile
            const mergedUser = {
                ...existingUser,
                linkedProviders: [
                    ...(existingUser.linkedProviders || ['email']),
                    newIdentityProviderData.provider
                ],
                lastMergedAt: new Date().toISOString()
            };

            console.info(`Accounts successfully merged for: ${mergedUser.email}`);
            return mergedUser;
        } catch (err) {
            console.error('Account merge failed:', err);
            return existingUser;
        }
    }
}
