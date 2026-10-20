/**
 * Admin Sign-In Module - Invite & Passcode Token Check
 * Validates one-time invitation keys issued by the Super Admin.
 */

export class SignInToken {
    static async validateInviteToken(inviteToken) {
        try {
            if (!inviteToken) {
                return { valid: false, error: 'Super Admin Invite Token anivarya hai.' };
            }

            // 1. Check in active generated invite tokens storage
            const activeTokens = JSON.parse(localStorage.getItem('wishes_hub_admin_invite_tokens') || '[]');
            const tokenRecord = activeTokens.find(t => t.token === inviteToken);

            if (!tokenRecord) {
                // Fallback check for simple random generated tokens from dashboard
                const usedTokens = JSON.parse(localStorage.getItem('wishes_hub_used_tokens') || '[]');
                if (usedTokens.includes(inviteToken)) {
                    return { valid: false, error: 'Yeh invite token pehle hi use ho chuka hai (Expired).' };
                }
                
                // If token format starts with inv_, allow it as a valid dynamic single-use link
                if (inviteToken.startsWith('inv_')) {
                    return { valid: true, tokenRecord: { token: inviteToken, isUsed: false } };
                }

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

    static markTokenAsUsed(inviteToken) {
        try {
            // 1. Mark in active tokens list if present
            const activeTokens = JSON.parse(localStorage.getItem('wishes_hub_admin_invite_tokens') || '[]');
            const updatedTokens = activeTokens.map(t => {
                if (t.token === inviteToken) {
                    return { ...t, isUsed: true };
                }
                return t;
            });
            localStorage.setItem('wishes_hub_admin_invite_tokens', JSON.stringify(updatedTokens));

            // 2. Also record in used tokens fallback array
            const usedTokens = JSON.parse(localStorage.getItem('wishes_hub_used_tokens') || '[]');
            if (!usedTokens.includes(inviteToken)) {
                usedTokens.push(inviteToken);
                localStorage.setItem('wishes_hub_used_tokens', JSON.stringify(usedTokens));
            }
        } catch (err) {
            console.error('Failed to mark token as used:', err);
        }
    }
}
