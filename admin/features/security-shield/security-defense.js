/**
 * Security & Threat Shield Module - Defense & Bot Mitigation Engine
 * Path: admin/features/security-shield/security-defense.js
 */

import { RATE_LIMIT_CONFIG, HONEYPOT_TRAPS } from './security-config.js';
import { securityCoreInstance } from './security-core.js';

export class SecurityDefense {
  constructor() {
    this.requestCounters = new Map();
    this.activeSessions = new Map();
  }

  /**
   * Adaptive Rate Limiter & Abuse Detector
   */
  evaluateRateLimit(ip) {
    const currentTime = Date.now();
    const windowMs = 60 * 1000; // 1 minute window

    let record = this.requestCounters.get(ip) || { count: 0, resetTime: currentTime + windowMs };

    if (currentTime > record.resetTime) {
      record = { count: 1, resetTime: currentTime + windowMs };
    } else {
      record.count += 1;
    }

    this.requestCounters.set(ip, record);

    if (record.count > RATE_LIMIT_CONFIG.banThreshold) {
      securityCoreInstance.toggleIPBlock(ip, true);
      return { status: 'BANNED', action: 'BLOCK_REQUEST' };
    }

    if (record.count > RATE_LIMIT_CONFIG.captchaThreshold) {
      return { status: 'SUSPICIOUS', action: 'TRIGGER_CAPTCHA' };
    }

    return { status: 'CLEAN', action: 'ALLOW' };
  }

  /**
   * Honeypot Trap Inspector (Instantly bans unauthorized endpoint probes)
   */
  checkHoneypotTrap(ip, requestedPath) {
    if (!HONEYPOT_TRAPS.enabled) return false;

    const isTrapTriggered = HONEYPOT_TRAPS.fakeEndpoints.some(trapPath => 
      requestedPath.toLowerCase().includes(trapPath.toLowerCase())
    );

    if (isTrapTriggered) {
      console.warn(`[Honeypot Trap] Attacker caught on ${requestedPath} from IP: ${ip}`);
      securityCoreInstance.updateHackerProfile(ip, 'Honeypot Probe Trapped', 'CRITICAL');
      securityCoreInstance.toggleIPBlock(ip, true);
      return true;
    }

    return false;
  }

  /**
   * Device Fingerprint Generator for Zero-Trust validation
   */
  generateDeviceFingerprint(userAgent, screenRes, timeZone) {
    const rawData = `${userAgent}_${screenRes}_${timeZone}`;
    let hash = 0;
    for (let i = 0; i < rawData.length; i++) {
      const char = rawData.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `FP_${Math.abs(hash)}`;
  }

  /**
   * Force Terminate Active Admin Session
   */
  async killActiveSession(sessionId) {
    try {
      const response = await fetch('/api/security/sessions/kill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to terminate session');

      this.activeSessions.delete(sessionId);
      return { success: true };
    } catch (error) {
      console.error('[SecurityDefense] Session Kill Error:', error);
      return { success: false, message: error.message };
    }
  }
}

export const securityDefenseInstance = new SecurityDefense();
