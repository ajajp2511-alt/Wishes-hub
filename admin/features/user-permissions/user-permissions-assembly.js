/**
 * User Permissions - Assembly File
 * Binds core logic, UI rendering, and all sub-modules together.
 */

import { userPermissionsCore } from './user-permissions-core.js';
import { UserPermissionsWakeLock } from './modules/user-permissions-wakelock.js';
import { UserPermissionsBattery } from './modules/user-permissions-battery.js';
import { UserPermissionsShare } from './modules/user-permissions-share.js';
import { UserPermissionsNotifications } from './modules/user-permissions-notifications.js';
import { UserPermissionsLocation } from './modules/user-permissions-location.js';
import { UserPermissionsClipboard } from './modules/user-permissions-clipboard.js';
import { UserPermissionsMic } from './modules/user-permissions-mic.js';
import { UserPermissionsBiometric } from './modules/user-permissions-biometric.js';
import { UserPermissionsImportExport } from './user-permissions-import-export.js';
import { PERMISSION_TYPES } from './user-permissions-config.js';

export class UserPermissionsAssembly {
    constructor(containerElement) {
        if (typeof containerElement === 'string') {
            this.container = document.querySelector(containerElement);
        } else {
            this.container = containerElement;
        }

        // Fallback: If no container is found, create one dynamically
        if (!this.container) {
            const existing = document.getElementById('dynamic-permissions-container');
            if (existing) {
                this.container = existing;
            } else {
                const newContainer = document.createElement('div');
                newContainer.id = 'dynamic-permissions-container';
                const mainContent = document.querySelector('main') || document.body;
                mainContent.appendChild(newContainer);
                this.container = newContainer;
            }
        }

        this.wakeLockModule = new UserPermissionsWakeLock();
    }

    async init() {
        if (!this.container) {
            console.error('UserPermissionsAssembly: Container element not found.');
            return;
        }

        try {
            // Load initial core state
            await userPermissionsCore.init();

            // Render main UI shell
            this.renderUI();
            
            // Bind event listeners for buttons/actions
            this.bindEvents();

            // Run background status checks where applicable
            await UserPermissionsBattery.checkBatteryStatus();
        } catch (err) {
            console.error('Error initializing UserPermissionsAssembly:', err);
            this.container.innerHTML = `<div class="permissions-error">Failed to load permissions module. Please refresh.</div>`;
        }
    }

    renderUI() {
        // Safe status fetchers with try-catch fallback
        const getSafeStatus = (module, fallback = 'prompt') => {
            try {
                if (module && typeof module.checkStatus === 'function') {
                    return module.checkStatus();
                }
            } catch (e) {
                console.warn('Status check failed:', e);
            }
            return fallback;
        };

        const notifStatus = getSafeStatus(UserPermissionsNotifications, 'prompt');
        const locStatus = getSafeStatus(UserPermissionsLocation, 'prompt');
        const micStatus = getSafeStatus(UserPermissionsMic, 'prompt');
        const bioStatus = getSafeStatus(UserPermissionsBiometric, 'prompt');

        this.container.innerHTML = `
            <div class="user-permissions-panel">
                <h3>Device & User Permissions Management</h3>
                <p>Manage and monitor browser permissions, hardware sensors, and feature access for Wishes Hub.</p>
                
                <div class="permissions-grid">
                    <div class="permission-card" data-perm="${PERMISSION_TYPES.NOTIFICATIONS}">
                        <span class="perm-name">Push Notifications</span>
                        <span class="perm-status status-${notifStatus}">${notifStatus}</span>
                        <button class="btn-perm-action" data-action="notification">Request Access</button>
                    </div>

                    <div class="permission-card" data-perm="${PERMISSION_TYPES.LOCATION}">
                        <span class="perm-name">Geolocation (Region Wishes)</span>
                        <span class="perm-status status-${locStatus}">${locStatus}</span>
                        <button class="btn-perm-action" data-action="location">Get Location</button>
                    </div>

                    <div class="permission-card" data-perm="${PERMISSION_TYPES.MICROPHONE}">
                        <span class="perm-name">Microphone (Voice Greeting)</span>
                        <span class="perm-status status-${micStatus}">${micStatus}</span>
                        <button class="btn-perm-action" data-action="mic">Enable Mic</button>
                    </div>

                    <div class="permission-card" data-perm="${PERMISSION_TYPES.BIOMETRIC}">
                        <span class="perm-name">Biometric / Passkey</span>
                        <span class="perm-status status-${bioStatus}">${bioStatus}</span>
                        <button class="btn-perm-action" data-action="biometric">Verify</button>
                    </div>
                </div>

                <div class="permissions-toolbar" style="margin-top: 20px; display: flex; gap: 10px;">
                    <button id="btn-export-perms" class="btn-secondary">Export Permissions Config</button>
                    <button id="btn-wakelock-toggle" class="btn-secondary">Toggle Wake Lock</button>
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.container.addEventListener('click', async (e) => {
            const actionBtn = e.target.closest('.btn-perm-action');
            if (actionBtn) {
                const action = actionBtn.getAttribute('data-action');
                await this.handleAction(action);
            }

            if (e.target.id === 'btn-export-perms') {
                if (UserPermissionsImportExport && typeof UserPermissionsImportExport.exportData === 'function') {
                    UserPermissionsImportExport.exportData();
                }
            }

            if (e.target.id === 'btn-wakelock-toggle') {
                if (this.wakeLockModule.wakeLock) {
                    await this.wakeLockModule.releaseLock();
                    e.target.textContent = 'Toggle Wake Lock (Off)';
                } else {
                    await this.wakeLockModule.requestLock();
                    e.target.textContent = 'Toggle Wake Lock (Active)';
                }
            }
        });
    }

    async handleAction(actionType) {
        switch (actionType) {
            case 'notification':
                await UserPermissionsNotifications.requestAndRegister();
                break;
            case 'location':
                if (typeof UserPermissionsLocation.requestLocation === 'function') {
                    await UserPermissionsLocation.requestLocation();
                }
                break;
            case 'mic':
                if (typeof UserPermissionsMic.requestMicrophone === 'function') {
                    await UserPermissionsMic.requestMicrophone();
                }
                break;
            case 'biometric':
                if (typeof UserPermissionsBiometric.verifyBiometric === 'function') {
                    await UserPermissionsBiometric.verifyBiometric();
                }
                break;
            default:
                console.warn('Unknown permission action:', actionType);
        }
        // Re-render UI to reflect updated statuses
        this.renderUI();
    }
}

// Universal Smart Router compatibility wrapper
export async function init(containerElement) {
    const assembly = new UserPermissionsAssembly(containerElement);
    await assembly.init();
    return assembly;
}
