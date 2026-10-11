/**
 * Brute-Force Protection & Lockout Rules Module (Optimized & Bug-Fixed)
 * Path: admin/features/auth-security/modules/brute-force-guard.js
 */

export class BruteForceGuardModule {
  static settings = {
    maxAttempts: 5,
    lockoutDuration: 15, // minutes
    captchaEnabled: true
  };

  static container = null;
  static core = null;
  static onUpdate = null;

  static render(container, core, onUpdate) {
    this.container = container;
    this.core = core;
    this.onUpdate = onUpdate;
    this.renderUI();
  }

  static renderUI() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0; color:#24292e;">🛑 Brute-Force Protection & Lockout Rules</h4>
        <p style="font-size:13px; color:#586069; margin-bottom: 20px;">Set login attempt thresholds, automated lockout timers, and CAPTCHA triggers.</p>

        <form id="brute-force-form" style="display: flex; flex-direction: column; gap: 15px; font-size: 13px;">
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <label style="font-weight: 600; color:#24292e;">Max Failed Login Attempts</label>
            <input type="number" id="max-attempts" value="${this.settings.maxAttempts}" min="1" max="10" style="padding: 8px; border-radius: 4px; border: 1px solid #e1e4e8; width: 100%; max-width: 300px;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 5px;">
            <label style="font-weight: 600; color:#24292e;">Lockout Duration (Minutes)</label>
            <input type="number" id="lockout-duration" value="${this.settings.lockoutDuration}" min="1" max="1440" style="padding: 8px; border-radius: 4px; border: 1px solid #e1e4e8; width: 100%; max-width: 300px;" />
          </div>

          <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
            <input type="checkbox" id="captcha-enabled" ${this.settings.captchaEnabled ? 'checked' : ''} style="width: 16px; height: 16px;" />
            <label for="captcha-enabled" style="font-weight: 600; cursor: pointer; color:#24292e;">Enable CAPTCHA after threshold breach</label>
          </div>

          <div style="margin-top: 10px;">
            <button type="submit" style="background: #2ea44f; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer;">Save Protection Rules</button>
          </div>
        </form>
      </div>
    `;

    this.bindEvents();
  }

  static bindEvents() {
    if (!this.container) return;

    const form = this.container.querySelector('#brute-force-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      this.settings = {
        maxAttempts: parseInt(this.container.querySelector('#max-attempts').value, 10),
        lockoutDuration: parseInt(this.container.querySelector('#lockout-duration').value, 10),
        captchaEnabled: this.container.querySelector('#captcha-enabled').checked
      };

      if (typeof this.onUpdate === 'function') {
        this.onUpdate({ action: 'BRUTE_FORCE_SETTINGS_UPDATED', settings: this.settings });
      }

      alert('Brute-force protection rules updated successfully!');
    });
  }

  static destroy() {
    this.container = null;
    this.core = null;
    this.onUpdate = null;
  }
}
