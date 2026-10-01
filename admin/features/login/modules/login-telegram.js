/**
 * Login - Telegram Authentication Sub-Module
 * Integrates Telegram Widget / WebApp login data.
 */

import { loginCore } from '../login-core.js';
import { LoginContextResolver } from '../login-context-resolver.js';

export class LoginTelegramAuth {
    static async handleTelegramLogin(telegramUserData, currentPath) {
        try {
            if (!telegramUserData || !telegramUserData.id) {
                throw new Error('Telegram login data aamanya nahi hai.');
            }

            const mockUser = {
                uid: 'tg_' + telegramUserData.id,
                name: telegramUserData.first_name,
                role: 'user'
            };
            const mockToken = 'tg_token_' + Math.random();

            const resolution = LoginContextResolver.resolveRedirect(mockUser.role, currentPath);
            loginCore.saveSession(mockUser, mockToken);

            return { success: true, redirectTo: resolution.redirectTo };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
                }
