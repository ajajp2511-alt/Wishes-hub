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
    if (!('serviceWorker' in navigator)) {
      return { success: false, error: 'Service Worker unsupported in this browser' };
    }

    try {
      const swPath = PWA_CONFIG?.serviceWorker?.script || '/sw.js';
      const swScope = PWA_CONFIG?.serviceWorker?.scope || '/';
      
      this.swRegistration = await navigator.serviceWorker.register(swPath, { scope: swScope });
      this.listenInstallPrompt();
      this.setupBroadcastChannel();
      return { success: true, status: 'Active' };
    } catch (err) {
      console.warn('[PWACore] SW Registration Fallback Warning:', err.message);
      return { success: false, error: err.message };
    }
  }

  listenInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
    });
  }

  async triggerInstallPrompt() {
    if (!this.deferredInstallPrompt) {
      return { success: false, message: 'Install prompt unavailable or already triggered' };
    }
    
    try {
      this.deferredInstallPrompt.prompt();
      const { outcome } = await this.deferredInstallPrompt.userChoice;
      this.deferredInstallPrompt = null;
      return { success: outcome === 'accepted' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  /**
   * Push Token Registry
   */
  async registerPushNotifications() {
    if (!('Notification' in window)) {
      return { success: false, message: 'Notifications unavailable on this device' };
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { success: false, message: 'Permission denied by user' };
      }

      const token = `push_tok_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      this.pushTokenRegistry.set(token, {
        device: navigator.userAgent || 'Unknown Device',
        registeredAt: new Date().toISOString(),
        status: 'active'
      });

      return { success: true, token };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  /**
   * Storage Quota Check
   */
  async getStorageDiagnostic() {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const usageBytes = estimate.usage || 0;
        const quotaBytes = estimate.quota || 1; // Prevent NaN

        const usedMB = (usageBytes / (1024 * 1024)).toFixed(2);
        const quotaMB = (quotaBytes / (1024 * 1024)).toFixed(2);
        const percentage = ((usageBytes / quotaBytes) * 100).toFixed(1);

        return { usedMB, quotaMB, percentage };
      }
    } catch (err) {
      console.warn('[PWACore] Storage estimate warning:', err);
    }
    return { usedMB: '0.00', quotaMB: '0.00', percentage: '0.0' };
  }

  /**
   * Clear Stale Cache
   */
  async clearAppCache() {
    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
        return true;
      } catch (err) {
        console.error('[PWACore] Cache clearance error:', err);
        return false;
      }
    }
    return false;
  }

  /**
   * Cross-Tab Broadcast Listener
   */
  setupBroadcastChannel() {
    if ('BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('wishes_hub_pwa_sync');
        channel.onmessage = (event) => {
          console.log('[PWA Broadcast Received]:', event.data);
        };
      } catch (err) {
        console.warn('[PWACore] BroadcastChannel init error:', err);
      }
    }
  }
}

export const pwaCoreInstance = new PWACore();
