/**
 * 3D Emergency Safe PIN Recovery Module
 * Path: wishes-hub/admin/features/3d/modules/3d-emergency-pin.js
 */

import { THREE_CONFIG } from '../3d-config.js';
import { coreEngine } from '../3d-core.js';

export class EmergencyPin {
  constructor() {
    this.moduleName = '3d-emergency-pin';
    this.maxAttempts = 3;
    this.failedAttempts = 0;
    this.isLockedOut = false;
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Validate emergency backup PIN for geofenced or locked wish sessions
  async verifyEmergencyPin(enteredPin, expectedPinHash) {
    if (this.isLockedOut) {
      throw new Error('[Emergency PIN] Security lockout active due to multiple failed attempts.');
    }

    if (!enteredPin || enteredPin.toString().length !== THREE_CONFIG.SECURITY.PIN_LENGTH) {
      throw new Error(`[Emergency PIN] PIN must be exactly ${THREE_CONFIG.SECURITY.PIN_LENGTH} digits.`);
    }

    const pinBuffer = new TextEncoder().encode(enteredPin.toString());
    const enteredHash = await coreEngine.calculateSHA256(pinBuffer);

    if (enteredHash === expectedPinHash) {
      this.failedAttempts = 0;
      coreEngine.emit('emergencypin:success', { timestamp: Date.now() });
      return { success: true, message: 'Emergency Safe PIN verified successfully.' };
    } else {
      this.failedAttempts++;
      if (this.failedAttempts >= this.maxAttempts) {
        this.isLockedOut = true;
        coreEngine.emit('emergencypin:lockout', { attempts: this.failedAttempts });
        throw new Error('[Emergency PIN] Maximum failed attempts reached. Session locked.');
      }

      coreEngine.emit('emergencypin:failed', { attemptsLeft: this.maxAttempts - this.failedAttempts });
      return { 
        success: false, 
        message: `Incorrect PIN. ${this.maxAttempts - this.failedAttempts} attempts remaining.` 
      };
    }
  }
}

export default EmergencyPin;
