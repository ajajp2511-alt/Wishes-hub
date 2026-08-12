/**
 * Security & Threat Shield Module - Core Engine & Log Streamer
 * Path: admin/features/security-shield/security-core.js
 */

import { 
  WAF_SIGNATURES, 
  SECURITY_SEVERITY, 
  SECURITY_CONFIG, 
  DOMAIN_LOCK_CONFIG,
  HONEYPOT_TRAPS 
} from './security-config.js';

export class SecurityCore {
  constructor() {
    this.threatLogs = [];
    this.blacklistedIPs = new Set();
    this.whitelistedIPs = new Set();
    this.hackerProfiles = new Map();
    
    // Auto-verify host environment on initialization
    this.verifyDomainLock();
  }

  /**
   * Domain Lock & Host Protection Shield
   * Restricts code execution strictly to authorized domains.
   */
  verifyDomainLock() {
    if (!DOMAIN_LOCK_CONFIG?.enabled || typeof window === 'undefined') return true;

    const currentHost = window.location.hostname.toLowerCase();
    const isAuthorized = DOMAIN_LOCK_CONFIG.authorizedDomains.some(domain => 
      currentHost === domain.toLowerCase() || currentHost.endsWith(`.${domain.toLowerCase()}`)
    );

    if (!isAuthorized) {
      console.error(`[SecurityCore Critical] Unauthorized host detected: ${currentHost}`);
      // Self-destruct / Freeze execution on unauthorized domains
      document.body.innerHTML = `
        <div style="background:#0d1117; color:#ff7b72; height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif; flex-direction:column; text-align:center;">
          <h1 style="font-size: 2.5rem; margin-bottom: 10px;">Security Lockout Active</h1>
          <p style="color:#8b949e; max-width: 500px;">This domain (${currentHost}) is not authorized to host or execute the Wishes Hub core engine.</p>
        </div>
      `;
      throw new Error(`[Security Core] Domain locking policy violation: ${currentHost}`);
    }

    return true;
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
   * Analyze payload against WAF Rules & Honeypot Traps
   */
  inspectPayload(ip, payloadStr, path) {
    let severity = SECURITY_SEVERITY.LOW;
    let attackType = null;

    // Check Honeypot Traps First
    if (HONEYPOT_TRAPS?.enabled && HONEYPOT_TRAPS.fakeEndpoints.includes(path)) {
      severity = SECURITY_SEVERITY.CRITICAL;
      attackType = 'Honeypot Trap Triggered';
    } 
    // WAF Rules Inspection
    else if (WAF_SIGNATURES.SQLI.test(payloadStr)) {
      severity = SECURITY_SEVERITY.CRITICAL;
      attackType = 'SQL Injection Attempt';
    } else if (WAF_SIGNATURES.XSS.test(payloadStr)) {
      severity = SECURITY_SEVERITY.HIGH;
      attackType = 'Cross-Site Scripting (XSS)';
    } else if (WAF_SIGNATURES.PATH_TRAVERSAL.test(payloadStr)) {
      severity = SECURITY_SEVERITY.MEDIUM;
      attackType = 'Path Traversal';
    } else if (WAF_SIGNATURES.COMMAND_INJECTION?.test(payloadStr)) {
      severity = SECURITY_SEVERITY.CRITICAL;
      attackType = 'Command Injection';
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
