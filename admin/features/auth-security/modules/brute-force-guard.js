/**
 * Brute-Force Protection & Lockout Rules Module
 * Path: admin/features/auth-security/modules/brute-force-guard-module.js
 */

export class BruteForceGuardModule {
  constructor() {
    this.settings = {
      maxAttempts: 5,
      lockoutDuration: 15, // minutes
      captchaEnabled: true
    };
  }

  render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0;">🛑 Brute-Force Protection & Lockout Rules</h4>
        <p style="font-size:13px; color:#586069; margin-bottom: 20px;">Set login attempt thresholds, automated lockout timers, and CAPTCHA triggers.</p>

        <form id="brute-force-form" style="display: flex; flexDirection: column; gap: 15px; font-size: 13px;">
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <label style="font-weight: 600;">Max Failed Login Attempts</label>
            <input type="number" id="max-attempts" value="${this.settings.maxAttempts}" min="1" max="10" style="padding: 8px; border-radius: 4px; border: 1px solid #e1e4e8; width: 100%; max-width: 300px;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 5px;">
            <label style="font-weight: 600;">Lockout Duration (Minutes)</label>
            <input type="number" id="lockout-duration" value="${this.settings.lockoutDuration}" min="1" max="1440" style="padding: 8px; border-radius: 4px; border: 1px solid #e1e4e8; width: 100%; max-width: 300px;" />
          </div>

          <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
            <input type="checkbox" id="captcha-enabled" ${this.settings.captchaEnabled ? 'checked' : ''} style="width: 16px; height: 16px;" />
            <label for="captcha-enabled" style="font-weight: 600; cursor: pointer;">Enable CAPTCHA after threshold breach</label>
          </div>

          <div style="margin-top: 10px;">
            <button type="submit" style="background: #2ea44f; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer;">Save Protection Rules</button>
          </div>
        </form>
      </div>
    `;
  }

  bindEvents(onUpdate) {
    const form = document.getElementById('brute-force-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      this.settings = {
        maxAttempts: parseInt(document.getElementById('max-attempts').value, 10),
        lockoutDuration: parseInt(document.getElementById('lockout-duration').value, 10),
        captchaEnabled: document.getElementById('captcha-enabled').checked
      };

      if (typeof onUpdate === 'function') {
        onUpdate({ action: 'BRUTE_FORCE_SETTINGS_UPDATED', settings: this.settings });
      }

      alert('Brute-force protection rules updated successfully!');
    });
  }
}
