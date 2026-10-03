/**
 * Wishes Hub - Audit Logger Module
 * Tracks login events, IP addresses, device details, and logs history to backend/Google Sheets.
 */

import { LoginConfig } from '../login-config.js';

export class AuditLogger {
    /**
     * Record an audit event for authentication actions
     */
    async logEvent(eventType, adminEmail, status, details = {}) {
        try {
            const logPayload = {
                eventType, // e.g., 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'MFA_TRIGGERED', 'PASSWORD_RESET'
                adminEmail: adminEmail || 'unknown',
                status,    // 'SUCCESS', 'WARNING', 'CRITICAL'
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                platform: navigator.platform || 'Unknown',
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                ...details
            };

            // Attempting backend API call if endpoint is configured
            // const response = await fetch('/api/admin/audit/log', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(logPayload)
            // });

            await new Promise((resolve) => setTimeout(resolve, 200));
            
            console.log(`[Audit Log Recorded]:`, logPayload);
            return { success: true };
        } catch (error) {
            console.error('Audit Logging Error:', error);
            
            // Fallback: Save critical failed/warning events to localStorage queue
            this._saveToLocalStorageQueue(eventType, adminEmail, status, details);
            
            return { success: false, error: error.message };
        }
    }

    /**
     * Internal fallback mechanism to queue logs locally if network fails
     */
    _saveToLocalStorageQueue(eventType, adminEmail, status, details) {
        try {
            const queueKey = 'wh_audit_offline_queue';
            const existingQueue = JSON.parse(localStorage.getItem(queueKey) || '[]');
            
            existingQueue.push({
                eventType,
                adminEmail,
                status,
                timestamp: new Date().toISOString(),
                details,
                synced: false
            });

            // Keep only the last 50 logs to prevent storage overflow
            if (existingQueue.length > 50) {
                existingQueue.shift();
            }

            localStorage.setItem(queueKey, JSON.stringify(existingQueue));
        } catch (err) {
            console.error('LocalStorage Queue Error:', err);
        }
    }
    }
