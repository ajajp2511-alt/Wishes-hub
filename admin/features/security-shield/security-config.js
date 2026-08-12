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
  SQLI: /(%27)|(\')|(\-\-)|(%23)|(#)|(SELECT|UNION|INSERT|DELETE|DROP|OR 1=1)/i,
  XSS: /(<script>|javascript:|onerror=|onload=|eval\()/i,
  PATH_TRAVERSAL: /(\.\.\/|\.\.\\|\/etc\/passwd|\/windows\/system32)/i,
  COMMAND_INJECTION: /(;|\|\||&&)/i
};

export const HONEYPOT_TRAPS = {
  enabled: true,
  fakeEndpoints: ['/admin/login_backup.php', '/api/v1/debug_env', '/wp-admin', '/.env'],
  autoBanDurationHours: 72
};

export const RATE_LIMIT_CONFIG = {
  maxRequestsPerMinute: 100,
  captchaThreshold: 60,
  banThreshold: 150
};

// --- DOMAIN LOCK, FIM & ENTERPRISE TOOLS CONFIG ---
export const DOMAIN_LOCK_CONFIG = {
  enabled: true,
  authorizedDomains: [
    'wishes-hub.vercel.app',
    'localhost',
    '127.0.0.1'
  ],
  licenseKeyHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
};

export const FIM_CONFIG = {
  enabled: true,
  monitoredDirectories: ['./admin', './src', './config'],
  alertOnNonAdminTouch: true
};

export const OPEN_SOURCE_TOOLS_CONFIG = {
  wazuhSIEM: true,
  crowdSecIPS: true,
  fail2ban: true,
  aquaTrivy: true,
  microsoftCodeQL: true
};

export const SECURITY_CONFIG = {
  endpoints: {
    fetchLogs: '/api/security/logs',
    updateFirewall: '/api/security/firewall',
    killSession: '/api/security/sessions/kill',
    emergencyLockdown: '/api/security/lockdown'
  }
};
