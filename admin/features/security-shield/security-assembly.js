/**
 * Security & Threat Shield Module - UI Assembly & Controller
 * Path: admin/features/security-shield/security-assembly.js
 */

import { SECURITY_SEVERITY } from './security-config.js';
import { securityCoreInstance } from './security-core.js';
import { securityDefenseInstance } from './security-defense.js';
import { securityPrivacyInstance } from './security-privacy.js';

export class SecurityAssembly {
  constructor() {
    this.container = null;
    this.activeTab = 'threat-logs';
  }

  /**
   * Initialize and render Security Shield feature into DOM
   */
  async init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderSkeleton();
    this.attachEventListeners();
    await this.loadSecurityData();
  }

  /**
   * Render Base Layout & Navigation Tabs
   */
  renderSkeleton() {
    this.container.innerHTML = `
      <div class="security-container">
        <!-- Module Header -->
        <header class="security-header">
          <div class="header-title">
            <h2>Security & Threat Shield</h2>
            <span class="status-indicator live">System Operational</span>
          </div>
          <button id="btn-panic-lockdown" class="btn-panic">Emergency Lockdown</button>
        </header>

        <!-- Sub Tabs Navigation -->
        <nav class="security-tabs">
          <button class="tab-btn active" data-tab="threat-logs">Live Threat Logs</button>
          <button class="tab-btn" data-tab="firewall-rules">IP Blacklist & Firewall</button>
          <button class="tab-btn" data-tab="bot-defense">Bot Defense & Limits</button>
          <button class="tab-btn" data-tab="hacker-profiles">Hacker Intelligence</button>
        </nav>

        <!-- Main Content Area -->
        <main id="security-main-view" class="security-main-view">
          <div class="security-loading">Loading Security Feeds...</div>
        </main>
      </div>
    `;
  }

  /**
   * Fetch Logs and Render Selected Tab View
   */
  async loadSecurityData() {
    await securityCoreInstance.fetchThreatLogs();
    this.renderActiveTabContent();
  }

  /**
   * Render Tab Content
   */
  renderActiveTabContent() {
    const mainView = this.container.querySelector('#security-main-view');

    if (this.activeTab === 'threat-logs') {
      this.renderThreatLogs(mainView);
    } else if (this.activeTab === 'firewall-rules') {
      this.renderFirewallRules(mainView);
    } else if (this.activeTab === 'bot-defense') {
      this.renderBotDefense(mainView);
    } else if (this.activeTab === 'hacker-profiles') {
      this.renderHackerIntelligence(mainView);
    } else {
      mainView.innerHTML = `<div class="security-placeholder">Feature configuration active. Monitoring live requests.</div>`;
    }
  }

  /**
   * Render Live Threat Logs View
   */
  renderThreatLogs(targetElement) {
    const logs = securityCoreInstance.threatLogs;

    if (logs.length === 0) {
      targetElement.innerHTML = `<div class="security-empty">No suspicious attack vectors detected.</div>`;
      return;
    }

    targetElement.innerHTML = `
      <table class="security-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Attacker IP</th>
            <th>Attack Type</th>
            <th>Severity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${logs.map(log => `
            <tr>
              <td><code>${new Date(log.timestamp || Date.now()).toLocaleTimeString()}</code></td>
              <td><code>${log.ip}</code></td>
              <td>${log.attackType}</td>
              <td><span class="badge badge-${(log.severity || 'low').toLowerCase()}">${log.severity}</span></td>
              <td>
                <button class="btn-sm btn-ban-ip" data-ip="${log.ip}">
                  ${securityCoreInstance.blacklistedIPs.has(log.ip) ? 'Unblock IP' : 'Block IP'}
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Render IP Blacklist & Firewall Manager View
   */
  renderFirewallRules(targetElement) {
    const blacklistedIPs = Array.from(securityCoreInstance.blacklistedIPs);

    targetElement.innerHTML = `
      <div class="firewall-manager">
        <div class="add-ip-bar">
          <input type="text" id="manual-ip-input" placeholder="Enter IP Address (e.g. 192.168.1.1)" />
          <button id="btn-manual-block" class="btn-primary">Ban IP Manually</button>
        </div>

        <h4>Active Blacklisted IPs (${blacklistedIPs.length})</h4>
        ${blacklistedIPs.length === 0 
          ? `<div class="security-empty">No IPs currently blacklisted by WAF or Admin.</div>`
          : `<ul class="ip-blacklist">
              ${blacklistedIPs.map(ip => `
                <li class="ip-item">
                  <code>${ip}</code>
                  <button class="btn-sm btn-ban-ip" data-ip="${ip}">Unblock IP</button>
                </li>
              `).join('')}
             </ul>`
        }
      </div>
    `;

    const blockBtn = targetElement.querySelector('#btn-manual-block');
    if (blockBtn) {
      blockBtn.addEventListener('click', async () => {
        const input = targetElement.querySelector('#manual-ip-input');
        const ip = input?.value.trim();
        if (ip) {
          await securityCoreInstance.toggleIPBlock(ip, true);
          this.renderActiveTabContent();
        }
      });
    }
  }

  /**
   * Render Bot Defense & Rate Limiting Controls View
   */
  renderBotDefense(targetElement) {
    targetElement.innerHTML = `
      <div class="bot-defense-panel">
        <h3>Rate Limiting & Anti-Bot Protection</h3>
        <div class="status-grid">
          <div class="status-card">
            <span>Rate Limit Window</span>
            <strong>100 Req / Min</strong>
          </div>
          <div class="status-card">
            <span>CAPTCHA Challenge Threshold</span>
            <strong>60 Req / Min</strong>
          </div>
          <div class="status-card">
            <span>Auto-Ban Duration</span>
            <strong>72 Hours</strong>
          </div>
          <div class="status-card">
            <span>Honeypot Endpoints Active</span>
            <strong>4 Traps</strong>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render Hacker Intelligence View
   */
  renderHackerIntelligence(targetElement) {
    const profiles = Array.from(securityCoreInstance.hackerProfiles.values());

    if (profiles.length === 0) {
      targetElement.innerHTML = `<div class="security-empty">No active attacker profiles generated yet.</div>`;
      return;
    }

    targetElement.innerHTML = `
      <div class="hacker-grid">
        ${profiles.map(profile => `
          <div class="hacker-card">
            <div class="card-header">
              <h4>IP: ${profile.ip}</h4>
              <span class="threat-score">Score: ${profile.threatScore}</span>
            </div>
            <p>Total Attacks: <strong>${profile.attacksCount}</strong></p>
            <p>Last Activity: ${new Date(profile.lastAttack).toLocaleString()}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Event Listeners Setup
   */
  attachEventListeners() {
    // Tab Switchers
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.activeTab = e.target.dataset.tab;
        this.renderActiveTabContent();
      });
    });

    // Ban/Unban IP Action
    this.container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn-ban-ip')) {
        const ip = e.target.dataset.ip;
        const isBanned = securityCoreInstance.blacklistedIPs.has(ip);
        await securityCoreInstance.toggleIPBlock(ip, !isBanned);
        this.renderActiveTabContent();
      }
    });

    // Panic Button Trigger
    const panicBtn = this.container.querySelector('#btn-panic-lockdown');
    if (panicBtn) {
      panicBtn.addEventListener('click', async () => {
        if (confirm('CRITICAL WARNING: Are you sure you want to trigger Emergency System Lockdown?')) {
          await securityPrivacyInstance.triggerEmergencyLockdown('Manual Admin Panic Trigger', { user: 'ROOT_ADMIN' });
          alert('System placed under Emergency Lockdown mode.');
        }
      });
    }
  }
}

export const securityAssemblyInstance = new SecurityAssembly();
