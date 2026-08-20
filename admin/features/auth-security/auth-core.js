/**
 * Auth Core Engine
 * Path: admin/features/auth-security/auth-core.js
 */

import { AUTH_CONFIG } from './auth-config.js';

export class AuthCore {
  constructor() {
    this.adminRoles = [
      { id: 'ROLE-01', name: 'Super Admin', permissions: ['ALL'], members: 2 },
      { id: 'ROLE-02', name: 'Content Moderator', permissions: ['WISHES_READ', 'WISHES_DELETE', 'SPAM_FLAG'], members: 5 },
      { id: 'ROLE-03', name: 'Support Agent', permissions: ['USERS_READ', 'LOGS_READ'], members: 8 }
    ];

    this.apiSecrets = [
      { keyId: 'SEC_JWT_MASTER', type: 'JWT Signing Secret', lastRotated: '2026-06-15', status: 'Active' },
      { keyId: 'SEC_HMAC_WEBHOOK', type: 'HMAC Webhook Key', lastRotated: '2026-07-01', status: 'Active' }
    ];

    this.ipWhitelist = [
      { id: 'IP-01', ipRange: '192.168.1.0/24', label: 'Office Primary Network', status: 'Whitelisted' },
      { id: 'IP-02', ipRange: '49.36.210.12', label: 'DevOps Fixed VPN Gateway', status: 'Whitelisted' }
    ];
  }

  getAdminRoles() { return this.adminRoles; }
  getApiSecrets() { return this.apiSecrets; }
  getIpWhitelist() { return this.ipWhitelist; }
}

export const authCoreInstance = new AuthCore();
