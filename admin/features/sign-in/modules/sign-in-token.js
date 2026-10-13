/**
 * Admin Sign-In Module - Invite & Passcode Token Check
 * Validates one-time invitation keys issued by the Super Admin.
 */

export class SignInToken {
    static async validateInviteToken(inviteToken, email) {
        try {
            if (!inviteToken) {
                return { valid: false, error: 'Super Admin Invite Token anivarya hai.' };
            }

            // Mock check for invite tokens (Replace with backend token lookup)
            const activeTokens = JSON.parse(localStorage.getItem('wishes_hub_admin_invite_tokens') || '[]');
            const tokenRecord = activeTokens.find(t => t.token === inviteToken && t.email === email);

            if (!tokenRecord) {
                return { valid: false, error: 'Invalid ya expired Super Admin invite token.' };
            }

            if (tokenRecord.isUsed) {
                return { valid: false, error: 'Yeh invite token pehle hi use ho chuka hai.' };
            }

            return { valid: true, tokenRecord };
        } catch (err) {
            return { valid: false, error: 'Token validation error: ' + err.message };
        }
    }
}
