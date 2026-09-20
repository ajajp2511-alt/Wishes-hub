/**
 * Security Anomaly & Breach Detector Module
 * Path: admin/features/auth-security/modules/security-anomaly-detector-module.js
 */

export class SecurityAnomalyDetectorModule {
  constructor() {
    this.anomalies = [
      { id: 'ANOM-101', type: 'Impossible Travel', user: 'admin@wishhub.com', ip: '49.36.120.8', time: '10 mins ago', severity: 'High' },
      { id: 'ANOM-102', type: 'Multi-Device Spike', user: 'creator_99', ip: '157.34.12.90', time: '1 hour ago', severity: 'Medium' }
    ];
  }

  render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div>
            <h4 style="margin:0; font-size: 16px;">⚠️ Security Anomaly & Breach Detector</h4>
            <p style="font-size:13px; color:#586069; margin: 5px 0 0 0;">Detect impossible travel logins, multi-device spikes, and unauthorized privilege escalations.</p>
          </div>
          <button id="btn-scan-anomalies" style="background: #0366d6; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 500;">Run Security Scan</button>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:13px;">
          <thead>
            <tr style="background:#f6f8fa; text-align:left;">
              <th style="padding:8px; border:1px solid #e1e4e8;">Alert ID</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Anomaly Type</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Target User</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">IP Address</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Time</th>
              <th style="padding:8px; border:1px solid #e1e4e8;">Severity</th>
            </tr>
          </thead>
          <tbody id="anomaly-table-body">
            ${this.anomalies.map(a => `
              <tr>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${a.id}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><b>${a.type}</b></td>
                <td style="padding:8px; border:1px solid #e1e4e8;">${a.user}</td>
                <td style="padding:8px; border:1px solid #e1e4e8;"><code>${a.ip}</code></td>
                <td style="padding:8px; border:1px solid #e1e4e8; color:#586069;">${a.time}</td>
                <td style="padding:8px; border:1px solid #e1e4e8; color: ${a.severity === 'High' ? '#d73a49' : '#f66a0a'}; font-weight:bold;">${a.severity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  bindEvents(onUpdate) {
    const scanBtn = document.getElementById('btn-scan-anomalies');
    scanBtn?.addEventListener('click', () => {
      scanBtn.textContent = 'Scanning...';
      scanBtn.disabled = true;

      setTimeout(() => {
        scanBtn.textContent = 'Run Security Scan';
        scanBtn.disabled = false;
        alert('Security scan completed. No new anomalies detected.');
        if (typeof onUpdate === 'function') {
          onUpdate({ action: 'SECURITY_SCAN_COMPLETED' });
        }
      }, 1000);
    });
  }
}
