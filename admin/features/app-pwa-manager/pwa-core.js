/**
 * App & PWA Manager - Core Logic & Native Capabilities
 * Path: admin/features/app-pwa-manager/pwa-core.js
 */

import { PWA_CONFIG } from './pwa-config.js';

export class PWACore {
  constructor() {
    this.swRegistration = null;
    this.deferredInstallPrompt = null;
    this.pushTokenRegistry = new Map();
    this.deepLinkRules = new Map([
      ['/wish/:id', 'WishViewerController'],
      ['/share/:code', 'SocialShareHandler']
    ]);
  }

  /**
   * Service Worker Initialization & Installation Capture
   */
  async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        this.listenInstallPrompt();
        this.setupBroadcastChannel();
        return { success: true, status: 'Active' };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    return { success: false, error: 'Service Worker unsupported' };
  }

  listenInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
    });
  }

  async triggerInstallPrompt() {
    if (!this.deferredInstallPrompt) return { success: false, message: 'Install prompt unavailable' };
    this.deferredInstallPrompt.prompt();
    const { outcome } = await this.deferredInstallPrompt.userChoice;
    this.deferredInstallPrompt = null;
    return { success: outcome === 'accepted' };
  }

  /**
   * Push Token Registry
   */
  async registerPushNotifications() {
    if (!('Notification' in window) || !this.swRegistration) {
      return { success: false, message: 'Notifications unavailable' };
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return { success: false, message: 'Permission denied' };

    const token = `push_tok_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    this.pushTokenRegistry.set(token, {
      device: navigator.userAgent,
      registeredAt: new Date().toISOString(),
      status: 'active'
    });

    return { success: true, token };
  }

  /**
   * Storage Quota Check
   */
  async getStorageDiagnostic() {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const usedMB = (estimate.usage / (1024 * 1024)).toFixed(2);
      const quotaMB = (estimate.quota / (1024 * 1024)).toFixed(2);
      return { usedMB, quotaMB, percentage: ((estimate.usage / estimate.quota) * 100).toFixed(1) };
    }
    return { usedMB: 0, quotaMB: 0, percentage: 0 };
  }

  /**
   * Clear Stale Cache
   */
  async clearAppCache() {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
      return true;
    }
    return false;
  }

  /**
   * Cross-Tab Broadcast Listener
   */
  setupBroadcastChannel() {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('wishes_hub_pwa_sync');
      channel.onmessage = (event) => {
        console.log('[PWA Broadcast Received]:', event.data);
      };
    }
  }
}

export const pwaCoreInstance = new PWACore();
