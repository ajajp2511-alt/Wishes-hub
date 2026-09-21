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
            // Fix: Support both ID string (with or without #) and CSS selectors
            const targetId = containerElement.startsWith('#') ? containerElement.substring(1) : containerElement;
            this.container = document.getElementById(targetId) || document.querySelector(containerElement);
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

        // Load initial core state
        await userPermissionsCore.init();

        // Render main UI shell
        this.renderUI();
        
        // Bind event listeners for buttons/actions
        this.bindEvents();

        // Run background status checks where applicable
        await UserPermissionsBattery.checkBatteryStatus();
    }

    renderUI() {
        this.container.innerHTML = `
            <div class="user-permissions-panel" style="padding: 16px; max-width: 1200px; margin: 0 auto; font-family: inherit;">
                <h3 style="font-size: 20px; font-weight: bold; color: #1f2937; margin: 0 0 4px 0;">Device & User Permissions Management</h3>
                <p style="font-size: 12px; color: #6b7280; margin: 0 0 16px 0;">Manage and monitor browser permissions, hardware sensors, and feature access for Wishes Hub.</p>
                
                <div class="permissions-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;">
                    <div class="permission-card" data-perm="${PERMISSION_TYPES.NOTIFICATIONS}" style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px;">
                        <span class="perm-name" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 4px;">Push Notifications</span>
                        <span class="perm-status status-${UserPermissionsNotifications.checkStatus()}" style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: #f3f4f6; display: inline-block; margin-bottom: 8px;">${UserPermissionsNotifications.checkStatus()}</span>
                        <button class="btn-perm-action" data-action="notification" style="display: block; width: 100%; font-size: 12px; background: #4f46e5; color: #fff; border: none; border-radius: 4px; padding: 6px; cursor: pointer;">Request Access</button>
                    </div>

                    <div class="permission-card" data-perm="${PERMISSION_TYPES.LOCATION}" style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px;">
                        <span class="perm-name" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 4px;">Geolocation (Region Wishes)</span>
                        <span class="perm-status status-prompt" style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: #f3f4f6; display: inline-block; margin-bottom: 8px;">Check</span>
                        <button class="btn-perm-action" data-action="location" style="display: block; width: 100%; font-size: 12px; background: #4f46e5; color: #fff; border: none; border-radius: 4px; padding: 6px; cursor: pointer;">Get Location</button>
                    </div>

                    <div class="permission-card" data-perm="${PERMISSION_TYPES.MICROPHONE}" style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px;">
                        <span class="perm-name" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 4px;">Microphone (Voice Greeting)</span>
                        <span class="perm-status status-prompt" style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: #f3f4f6; display: inline-block; margin-bottom: 8px;">Check</span>
                        <button class="btn-perm-action" data-action="mic" style="display: block; width: 100%; font-size: 12px; background: #4f46e5; color: #fff; border: none; border-radius: 4px; padding: 6px; cursor: pointer;">Enable Mic</button>
                    </div>

                    <div class="permission-card" data-perm="${PERMISSION_TYPES.BIOMETRIC}" style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px;">
                        <span class="perm-name" style="font-weight: bold; font-size: 13px; display: block; margin-bottom: 4px;">Biometric / Passkey</span>
                        <span class="perm-status status-prompt" style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: #f3f4f6; display: inline-block; margin-bottom: 8px;">Check</span>
                        <button class="btn-perm-action" data-action="biometric" style="display: block; width: 100%; font-size: 12px; background: #4f46e5; color: #fff; border: none; border-radius: 4px; padding: 6px; cursor: pointer;">Verify</button>
                    </div>
                </div>

                <div class="permissions-toolbar" style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button id="btn-export-perms" class="btn-secondary" style="font-size: 12px; background: #e5e7eb; color: #374151; border: none; border-radius: 4px; padding: 8px 12px; cursor: pointer;">Export Permissions Config</button>
                    <button id="btn-wakelock-toggle" class="btn-secondary" style="font-size: 12px; background: #e5e7eb; color: #374151; border: none; border-radius: 4px; padding: 8px 12px; cursor: pointer;">Toggle Wake Lock</button>
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
                UserPermissionsImportExport.exportData();
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
                await UserPermissionsLocation.requestLocation();
                break;
            case 'mic':
                await UserPermissionsMic.requestMicrophone();
                break;
            case 'biometric':
                await UserPermissionsBiometric.verifyBiometric();
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
