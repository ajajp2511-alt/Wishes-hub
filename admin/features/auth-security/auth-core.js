/**
 * Auth Core Engine (Optimized with Consistent Returns & Edit/Update Methods)
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
      console.error('Error loading auth data from localStorage, resetting to defaults:', e);
      localStorage.removeItem('wh_admin_roles');
      localStorage.removeItem('wh_api_secrets');
      localStorage.removeItem('wh_ip_whitelist');
      this.loadFromStorage(); // Reload defaults
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

  // --- Admin Roles Actions ---
  addAdminRole(role) {
    if (!role || !role.id || !role.name) {
      return { success: false, message: 'Invalid role data provided.' };
    }
    
    const exists = this.adminRoles.some(r => r.id === role.id);
    if (exists) {
      return { success: false, message: 'Role ID already exists.' };
    }

    this.adminRoles.push(role);
    this.saveToStorage();
    return { success: true, message: 'Role added successfully.' };
  }

  removeAdminRole(roleId) {
    const initialLength = this.adminRoles.length;
    this.adminRoles = this.adminRoles.filter(r => r.id !== roleId);
    
    if (this.adminRoles.length !== initialLength) {
      this.saveToStorage();
      return { success: true, message: 'Role removed successfully.' };
    }
    return { success: false, message: 'Role ID not found.' };
  }

  // --- API Secrets Actions ---
  rotateApiSecret(keyId) {
    const secret = this.apiSecrets.find(s => s.keyId === keyId);
    if (!secret) {
      return { success: false, message: 'API Secret key ID not found.' };
    }

    secret.lastRotated = new Date().toISOString().split('T')[0];
    secret.status = 'Active';
    this.saveToStorage();
    return { success: true, message: `API Secret ${keyId} rotated successfully.` };
  }

  // --- IP Whitelist Actions ---
  addIpEntry(entry) {
    if (!entry || !entry.id || !entry.ipRange) {
      return { success: false, message: 'Invalid IP entry data provided.' };
    }

    const exists = this.ipWhitelist.some(ip => ip.id === entry.id);
    if (exists) {
      return { success: false, message: 'IP Entry ID already exists.' };
    }

    this.ipWhitelist.push(entry);
    this.saveToStorage();
    return { success: true, message: 'IP entry added successfully.' };
  }

  removeIpEntry(id) {
    const initialLength = this.ipWhitelist.length;
    this.ipWhitelist = this.ipWhitelist.filter(ip => ip.id !== id);
    
    if (this.ipWhitelist.length !== initialLength) {
      this.saveToStorage();
      return { success: true, message: 'IP entry removed successfully.' };
    }
    return { success: false, message: 'IP Entry ID not found.' };
  }
}

export const authCoreInstance = new AuthCore();
