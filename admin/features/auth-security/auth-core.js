/**
 * Auth Core Engine (Improved with LocalStorage Persistence & Mutation Methods)
 * Path: admin/features/auth-security/auth-core.js
 */

import { AUTH_CONFIG } from './auth-config.js';

export class AuthCore {
  constructor() {
    this.config = AUTH_CONFIG;
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const savedRoles = localStorage.getItem('wh_admin_roles');
      const savedSecrets = localStorage.getItem('wh_api_secrets');
      const savedIps = localStorage.getItem('wh_ip_whitelist');

      this.adminRoles = savedRoles ? JSON.parse(savedRoles) : [
        { id: 'ROLE-01', name: 'Super Admin', permissions: ['ALL'], members: 2 },
        { id: 'ROLE-02', name: 'Content Moderator', permissions: ['WISHES_READ', 'WISHES_DELETE', 'SPAM_FLAG'], members: 5 },
        { id: 'ROLE-03', name: 'Support Agent', permissions: ['USERS_READ', 'LOGS_READ'], members: 8 }
      ];

      this.apiSecrets = savedSecrets ? JSON.parse(savedSecrets) : [
        { keyId: 'SEC_JWT_MASTER', type: 'JWT Signing Secret', lastRotated: '2026-06-15', status: 'Active' },
        { keyId: 'SEC_HMAC_WEBHOOK', type: 'HMAC Webhook Key', lastRotated: '2026-07-01', status: 'Active' }
      ];

      this.ipWhitelist = savedIps ? JSON.parse(savedIps) : [
        { id: 'IP-01', ipRange: '192.168.1.0/24', label: 'Office Primary Network', status: 'Whitelisted' },
        { id: 'IP-02', ipRange: '49.36.210.12', label: 'DevOps Fixed VPN Gateway', status: 'Whitelisted' }
      ];
    } catch (e) {
      console.error('Error loading auth data from localStorage:', e);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('wh_admin_roles', JSON.stringify(this.adminRoles));
      localStorage.setItem('wh_api_secrets', JSON.stringify(this.apiSecrets));
      localStorage.setItem('wh_ip_whitelist', JSON.stringify(this.ipWhitelist));
    } catch (e) {
      console.error('Error saving auth data to localStorage:', e);
    }
  }

  // Getters
  getAdminRoles() { return this.adminRoles; }
  getApiSecrets() { return this.apiSecrets; }
  getIpWhitelist() { return this.ipWhitelist; }
  getConfig() { return this.config; }

  // Mutations / Actions with Persistence
  addAdminRole(role) {
    if (!role || !role.id) return false;
    this.adminRoles.push(role);
    this.saveToStorage();
    return true;
  }

  removeAdminRole(roleId) {
    this.adminRoles = this.adminRoles.filter(r => r.id !== roleId);
    this.saveToStorage();
    return true;
  }

  rotateApiSecret(keyId) {
    const secret = this.apiSecrets.find(s => s.keyId === keyId);
    if (secret) {
      secret.lastRotated = new Date().toISOString().split('T')[0];
      secret.status = 'Active';
      this.saveToStorage();
      return true;
    }
    return false;
  }

  addIpEntry(entry) {
    if (!entry || !entry.ipRange) return false;
    this.ipWhitelist.push(entry);
    this.saveToStorage();
    return true;
  }

  removeIpEntry(id) {
    this.ipWhitelist = this.ipWhitelist.filter(ip => ip.id !== id);
    this.saveToStorage();
    return true;
  }
}

export const authCoreInstance = new AuthCore();
