/**
 * App & PWA Manager - UI Assembly & View Render
 * Path: admin/features/app-pwa-manager/pwa-assembly.js
 */

import { PWA_CONFIG } from './pwa-config.js';
import { pwaCoreInstance } from './pwa-core.js';

export class PWAAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'manifest-workers';
  }

  async init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    await pwaCoreInstance.initServiceWorker();
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="pwa-manager-container">
        <!-- Module Header -->
        <header class="pwa-header">
          <h2>App & PWA Manager</h2>
          <span class="badge live">Version ${PWA_CONFIG.version}</span>
        </header>

        <!-- Sub Tabs Navigation -->
        <nav class="pwa-tabs">
          <button class="tab-btn active" data-subtab="manifest-workers">PWA Manifest & Workers</button>
          <button class="tab-btn" data-subtab="push-registry">App Push Token Registry</button>
          <button class="tab-btn" data-subtab="deep-links">Deep Link Rules</button>
          <button class="tab-btn" data-subtab="storage-cache">Cache & Diagnostics</button>
        </nav>

        <!-- Dynamic Main View -->
        <main id="pwa-main-view" class="pwa-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#pwa-main-view');

    if (this.activeSubTab === 'manifest-workers') {
      this.renderManifestView(view);
    } else if (this.activeSubTab === 'push-registry') {
      this.renderPushRegistryView(view);
    } else if (this.activeSubTab === 'deep-links') {
      this.renderDeepLinksView(view);
    } else if (this.activeSubTab === 'storage-cache') {
      this.renderStorageCacheView(view);
    }
  }

  renderManifestView(target) {
    target.innerHTML = `
      <div class="pwa-card-grid">
        <div class="pwa-card">
          <h4>Service Worker Lifecycle</h4>
          <p>Status: <strong style="color: #2da44e;">Active / Running</strong></p>
          <p>Scope: <code>${PWA_CONFIG.serviceWorker.scope}</code></p>
          <button id="btn-trigger-install" class="btn-primary">Prompt App Install</button>
        </div>

        <div class="pwa-card">
          <h4>Manifest Properties</h4>
          <p>App Name: <strong>${PWA_CONFIG.manifest.name}</strong></p>
          <p>Display Mode: <code>${PWA_CONFIG.manifest.display}</code></p>
          <p>Shortcuts: <strong>${PWA_CONFIG.manifest.shortcuts.length} Active Actions</strong></p>
        </div>
      </div>
    `;
  }

  renderPushRegistryView(target) {
    const tokens = Array.from(pwaCoreInstance.pushTokenRegistry.entries());
    target.innerHTML = `
      <div class="push-registry-panel">
        <div class="push-actions-bar">
          <button id="btn-register-device" class="btn-primary">Register Current Device</button>
        </div>
        <h4>Active Registered Push Tokens (${tokens.length})</h4>
        ${tokens.length === 0 
          ? `<div class="security-empty">No device push tokens registered yet.</div>`
          : `<ul class="token-list">
              ${tokens.map(([token, data]) => `
                <li class="token-item">
                  <code>${token}</code>
                  <span>${data.device.substring(0, 30)}...</span>
                </li>
              `).join('')}
             </ul>`
        }
      </div>
    `;
  }

  renderDeepLinksView(target) {
    const rules = Array.from(pwaCoreInstance.deepLinkRules.entries());
    target.innerHTML = `
      <div class="deep-links-panel">
        <h4>Configured Deep Link Routing Rules</h4>
        <table class="pwa-table">
          <thead>
            <tr>
              <th>URL Pattern</th>
              <th>Target Route / Handler</th>
            </tr>
          </thead>
          <tbody>
            ${rules.map(([pattern, handler]) => `
              <tr>
                <td><code>${pattern}</code></td>
                <td>${handler}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  async renderStorageCacheView(target) {
    const storage = await pwaCoreInstance.getStorageDiagnostic();
    target.innerHTML = `
      <div class="storage-panel">
        <h4>Cache & Storage Diagnostics</h4>
        <p>Cache Usage: <strong>${storage.usedMB} MB / ${storage.quotaMB} MB (${storage.percentage}%)</strong></p>
        <button id="btn-purge-cache" class="btn-danger">Purge & Reload Cache</button>
      </div>
    `;

    target.querySelector('#btn-purge-cache')?.addEventListener('click', async () => {
      await pwaCoreInstance.clearAppCache();
      alert('App Cache Purged Successfully!');
      this.renderActiveSubTab();
    });
  }

  attachEventListeners() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.activeSubTab = e.target.dataset.subtab;
        this.renderActiveSubTab();
      });
    });

    this.container.addEventListener('click', async (e) => {
      if (e.target.id === 'btn-trigger-install') {
        const res = await pwaCoreInstance.triggerInstallPrompt();
        alert(res.success ? 'Installation Initiated!' : res.message || 'Install Banner Skipped');
      }

      if (e.target.id === 'btn-register-device') {
        const res = await pwaCoreInstance.registerPushNotifications();
        if (res.success) {
          alert(`Push Token Registered: ${res.token}`);
          this.renderActiveSubTab();
        } else {
          alert(`Push Error: ${res.message}`);
        }
      }
    });
  }
}

export const pwaAssemblyInstance = new PWAAssembly();
