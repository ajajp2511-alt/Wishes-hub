/**
 * 3D Geofenced Wish Delivery & Safe Zone Module
 * Path: wishes-hub/admin/features/3d/modules/3d-geo-lock.js
 */

import { THREE_CONFIG } from '../3d-config.js';
import { coreEngine } from '../3d-core.js';

export class GeoLock {
  constructor() {
    this.moduleName = '3d-geo-lock';
    this.currentPosition = null;
    this.watchId = null;
    this.init();
  }

  init() {
    coreEngine.registerModule(this.moduleName, this);
    console.log(`[Module] ${this.moduleName} initialized.`);
  }

  // Request user GPS coordinates with strict 1km safe-zone boundary validation
  async verifyGeofence(targetLocation) {
    if (!targetLocation || !targetLocation.latitude || !targetLocation.longitude) {
      throw new Error('[GeoLock] Target coordinates missing.');
    }

    try {
      const position = await this.getCurrentGPSPosition();
      this.currentPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      const distanceKm = this.calculateDistance(
        this.currentPosition.latitude,
        this.currentPosition.longitude,
        targetLocation.latitude,
        targetLocation.longitude
      );

      const maxRadiusKm = THREE_CONFIG.SECURITY.GEOFENCE_MAX_RADIUS_KM || 1.0;
      const isWithinZone = distanceKm <= maxRadiusKm;

      coreEngine.emit('geolock:verified', {
        distanceKm,
        isWithinZone,
        maxRadiusKm
      });

      return {
        isWithinZone,
        distanceKm,
        message: isWithinZone ? 'Device is inside the approved Safe Zone.' : 'Device is outside the 1km geofenced boundary.'
      };
    } catch (error) {
      console.error('[GeoLock Error]', error);
      throw error;
    }
  }

  getCurrentGPSPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('[GeoLock] Geolocation API is not supported by this browser.'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      }
    });
  }

  // Haversine formula to compute accurate distance between GPS coordinates in kilometers
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in KM
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  degToRad(deg) {
    return deg * (Math.PI / 180);
  }
}

export default GeoLock;
