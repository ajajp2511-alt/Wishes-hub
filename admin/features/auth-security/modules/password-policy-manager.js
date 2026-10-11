/**
 * Password Complexity & Health Policy Module (Optimized & Bug-Fixed)
 * Path: admin/features/auth-security/modules/password-policy-manager.js
 */

export class PasswordPolicyManagerModule {
  static policy = {
    minLength: 8,
    requireNumbers: true,
    requireSymbols: true,
    requireUppercase: true
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
        <h4 style="margin-top:0; color: #24292e;">🔐 Password Complexity & Health Policy</h4>
        <p style="font-size:13px; color:#586069; margin-bottom: 20px;">Enforce password length, special characters, expiration schedules, and breach checks.</p>

        <form id="password-policy-form" style="display: flex; flex-direction: column; gap: 15px; font-size: 13px;">
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <label style="font-weight: 600; color: #24292e;">Minimum Password Length</label>
            <input type="number" id="min-length" value="${this.policy.minLength}" min="6" max="32" style="padding: 8px; border-radius: 4px; border: 1px solid #e1e4e8; width: 100%; max-width: 300px;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 5px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <input type="checkbox" id="req-numbers" ${this.policy.requireNumbers ? 'checked' : ''} style="width: 16px; height: 16px;" />
              <label for="req-numbers" style="font-weight: 600; cursor: pointer; color: #24292e;">Require at least one number (0-9)</label>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
              <input type="checkbox" id="req-symbols" ${this.policy.requireSymbols ? 'checked' : ''} style="width: 16px; height: 16px;" />
              <label for="req-symbols" style="font-weight: 600; cursor: pointer; color: #24292e;">Require at least one special character (!@#$%^&*)</label>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
              <input type="checkbox" id="req-uppercase" ${this.policy.requireUppercase ? 'checked' : ''} style="width: 16px; height: 16px;" />
              <label for="req-uppercase" style="font-weight: 600; cursor: pointer; color: #24292e;">Require at least one uppercase letter (A-Z)</label>
            </div>
          </div>

          <div style="margin-top: 10px;">
            <button type="submit" style="background: #2ea44f; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer;">Save Password Policy</button>
          </div>
        </form>
      </div>
    `;

    this.bindEvents();
  }

  static bindEvents() {
    if (!this.container) return;

    const form = this.container.querySelector('#password-policy-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const minLengthInput = this.container.querySelector('#min-length');
      const reqNumbersInput = this.container.querySelector('#req-numbers');
      const reqSymbolsInput = this.container.querySelector('#req-symbols');
      const reqUppercaseInput = this.container.querySelector('#req-uppercase');

      this.policy = {
        minLength: minLengthInput ? parseInt(minLengthInput.value, 10) : 8,
        requireNumbers: reqNumbersInput ? reqNumbersInput.checked : true,
        requireSymbols: reqSymbolsInput ? reqSymbolsInput.checked : true,
        requireUppercase: reqUppercaseInput ? reqUppercaseInput.checked : true
      };

      if (typeof this.onUpdate === 'function') {
        this.onUpdate({ action: 'PASSWORD_POLICY_UPDATED', policy: this.policy });
      }

      alert('Password policy updated successfully!');
    });
  }

  static destroy() {
    this.container = null;
    this.core = null;
    this.onUpdate = null;
  }
}
