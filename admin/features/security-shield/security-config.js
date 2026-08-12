/**
 * Security & Threat Shield Module - Configuration & Threat Rules
 * Path: admin/features/security-shield/security-config.js
 */

export const SECURITY_SEVERITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

export const FIREWALL_MODES = {
  STRICT: 'Strict',
  ADAPTIVE: 'Adaptive',
  PERMISSIVE: 'Permissive',
  LOCKDOWN: 'Emergency Lockdown'
};

export const WAF_SIGNATURES = {
  SQLI: /(%27)|(\')|(\-\-)|(%23)|(#)/i,
  XSS: /(<script>|javascript:|onerror=|onload=)/i,
  PATH_TRAVERSAL: /(\.\.\/|\.\.\\)/i,
  COMMAND_INJECTION: /(;|\|\||&&)/i
};

export const HONEYPOT_TRAPS = {
  enabled: true,
  fakeEndpoints: ['/admin/login_backup.php', '/api/v1/debug_env', '/wp-admin'],
  autoBanDurationHours: 72
};

export const RATE_LIMIT_CONFIG = {
  maxRequestsPerMinute: 100,
  captchaThreshold: 60,
  banThreshold: 150
};

export const SECURITY_CONFIG = {
  endpoints: {
    fetchLogs: '/api/security/logs',
    updateFirewall: '/api/security/firewall',
    killSession: '/api/security/sessions/kill',
    emergencyLockdown: '/api/security/lockdown'
  }
};
