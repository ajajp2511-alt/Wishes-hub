/**
 * Security & Threat Shield Module - Core Engine & Log Streamer
 * Path: admin/features/security-shield/security-core.js
 */

import { WAF_SIGNATURES, SECURITY_SEVERITY, SECURITY_CONFIG } from './security-config.js';

export class SecurityCore {
  constructor() {
    this.threatLogs = [];
    this.blacklistedIPs = new Set();
    this.whitelistedIPs = new Set();
    this.hackerProfiles = new Map();
  }

  /**
   * Fetch recent threat & attack logs
   */
  async fetchThreatLogs() {
    try {
      const response = await fetch(SECURITY_CONFIG.endpoints.fetchLogs);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to fetch security logs');

      this.threatLogs = result.data || [];
      return { success: true, logs: this.threatLogs };
    } catch (error) {
      console.error('[SecurityCore] Log Fetch Error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Analyze payload against WAF Rules
   */
  inspectPayload(ip, payloadStr, path) {
    let severity = SECURITY_SEVERITY.LOW;
    let attackType = null;

    if (WAF_SIGNATURES.SQLI.test(payloadStr)) {
      severity = SECURITY_SEVERITY.CRITICAL;
      attackType = 'SQL Injection Attempt';
    } else if (WAF_SIGNATURES.XSS.test(payloadStr)) {
      severity = SECURITY_SEVERITY.HIGH;
      attackType = 'Cross-Site Scripting (XSS)';
    } else if (WAF_SIGNATURES.PATH_TRAVERSAL.test(payloadStr)) {
      severity = SECURITY_SEVERITY.MEDIUM;
      attackType = 'Path Traversal';
    }

    if (attackType) {
      this.updateHackerProfile(ip, attackType, severity);
    }

    return { detected: !!attackType, attackType, severity };
  }

  /**
   * Build Hacker Profile & Score
   */
  updateHackerProfile(ip, attackType, severity) {
    const profile = this.hackerProfiles.get(ip) || {
      ip,
      attacksCount: 0,
      threatScore: 0,
      lastAttack: null,
      history: []
    };

    profile.attacksCount += 1;
    profile.lastAttack = new Date().toISOString();
    profile.history.push({ attackType, timestamp: profile.lastAttack });

    if (severity === SECURITY_SEVERITY.CRITICAL) profile.threatScore += 40;
    else if (severity === SECURITY_SEVERITY.HIGH) profile.threatScore += 25;
    else profile.threatScore += 10;

    if (profile.threatScore >= 100) {
      this.blacklistedIPs.add(ip);
    }

    this.hackerProfiles.set(ip, profile);
  }

  /**
   * Add or Remove IP from Firewall Blacklist
   */
  async toggleIPBlock(ip, blockStatus) {
    try {
      const response = await fetch(SECURITY_CONFIG.endpoints.updateFirewall, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, action: blockStatus ? 'BAN' : 'UNBAN' })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Firewall update failed');

      if (blockStatus) {
        this.blacklistedIPs.add(ip);
      } else {
        this.blacklistedIPs.delete(ip);
      }

      return { success: true };
    } catch (error) {
      console.error('[SecurityCore] IP Toggle Error:', error);
      return { success: false, message: error.message };
    }
  }
}

export const securityCoreInstance = new SecurityCore();
