/**
 * Automation Core Pipeline Engine
 * Path: admin/features/automation/automation-core.js
 * Description: Master state manager, queue processor, event bus, and operational logger
 *              for the automation module.
 */

import { AUTOMATION_CONFIG } from './automation-config.js';

class AutomationCoreEngine {
  constructor() {
    this.config = AUTOMATION_CONFIG;
    this.state = {
      initialized: false,
      activeQueue: [],
      publishedFestivals: [],
      activeSponsors: [],
      systemLogs: [],
      metrics: {
        totalGenerated: 0,
        total3DWishesCreated: 0,
        totalSponsorsOnboarded: 0,
        totalViralShares: 0
      }
    };
    this.listeners = new Map();
  }

  /**
   * Initialize Core Pipeline State from Local Storage / Remote Data
   */
  async initialize() {
    try {
      const savedState = localStorage.getItem(this.config.storageKey);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        this.state = { ...this.state, ...parsed };
      }
      this.state.initialized = true;
      this.log('CORE', 'Automation Core Pipeline Engine successfully initialized.', 'SUCCESS');
      this.emit('initialized', this.state);
      return { success: true, state: this.state };
    } catch (error) {
      this.log('CORE', `Initialization error: ${error.message}`, 'ERROR');
      return { success: false, error: error.message };
    }
  }

  /**
   * Persistent State Saver
   */
  saveState() {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.state));
      this.emit('stateSaved', this.state);
    } catch (error) {
      this.log('CORE', `Failed to save automation state: ${error.message}`, 'ERROR');
    }
  }

  /**
   * Event Bus System (Subscribe to pipeline events)
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Emit Event across Assembly Controllers
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  /**
   * System Activity & Audit Logger
   */
  log(source, message, level = 'INFO') {
    const logEntry = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      source,
      message,
      level
    };
    this.state.systemLogs.unshift(logEntry);
    
    // Keep max 200 logs
    if (this.state.systemLogs.length > 200) {
      this.state.systemLogs.pop();
    }
    
    console.log(`[WishesHub-Automation] [${level}] [${source}]: ${message}`);
    this.saveState();
    this.emit('logAdded', logEntry);
  }

  /**
   * Queue Management for Upcoming Auto-Generated Events
   */
  addToQueue(queueItem) {
    const item = {
      id: 'q_' + Date.now(),
      status: 'STAGED', // STAGED, PUBLISHED, ARCHIVED
      createdAt: new Date().toISOString(),
      ...queueItem
    };
    this.state.activeQueue.unshift(item);
    this.state.metrics.totalGenerated++;
    this.log('QUEUE', `Staged new festival automation: ${item.festivalName || item.id}`, 'INFO');
    this.saveState();
    this.emit('queueUpdated', this.state.activeQueue);
    return item;
  }

  /**
   * Update Queue Item Status
   */
  updateQueueStatus(itemId, newStatus) {
    const target = this.state.activeQueue.find(i => i.id === itemId);
    if (target) {
      target.status = newStatus;
      target.updatedAt = new Date().toISOString();
      this.log('QUEUE', `Queue item ${itemId} updated to status: ${newStatus}`, 'SUCCESS');
      this.saveState();
      this.emit('queueUpdated', this.state.activeQueue);
      return true;
    }
    return false;
  }

  /**
   * Get Current Module Operational Metrics
   */
  getMetrics() {
    return { ...this.state.metrics };
  }
}

// Global Single Instance Export
export const automationCore = new AutomationCoreEngine();
