/**
 * Multi-Factor Authentication (MFA / 2FA) Enforcement Module (Optimized & Bug-Fixed)
 * Path: admin/features/auth-security/modules/mfa-enforcement.js
 */

export class MfaEnforcementModule {
  static mfaPolicy = 'mandatory_admins'; // Default policy
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
        <h4 style="margin-top:0; color: #24292e;">📲 Multi-Factor Authentication (MFA / 2FA) Enforcement</h4>
        <p style="font-size:13px; color:#586069; margin-bottom: 20px;">Require TOTP or SMS verification for privileged admin accounts.</p>

        <form id="mfa-form" style="display: flex; flex-direction: column; gap: 15px; font-size: 13px;">
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <label style="font-weight: 600; color: #24292e;">MFA Enforcement Policy</label>
            <select id="mfa-policy-select" style="padding: 8px; border-radius: 4px; border: 1px solid #e1e4e8; width: 100%; max-width: 350px;">
              <option value="disabled" ${this.mfaPolicy === 'disabled' ? 'selected' : ''}>Disabled (Optional for all)</option>
              <option value="mandatory_admins" ${this.mfaPolicy === 'mandatory_admins' ? 'selected' : ''}>Mandatory for Privileged Admins</option>
              <option value="mandatory_all" ${this.mfaPolicy === 'mandatory_all' ? 'selected' : ''}>Mandatory for All Users</option>
            </select>
          </div>

          <div style="margin-top: 10px;">
            <button type="submit" style="background: #2ea44f; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer;">Update MFA Policy</button>
          </div>
        </form>
      </div>
    `;

    this.bindEvents();
  }

  static bindEvents() {
    if (!this.container) return;

    const form = this.container.querySelector('#mfa-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const selectElement = this.container.querySelector('#mfa-policy-select');
      if (selectElement) {
        this.mfaPolicy = selectElement.value;
      }

      if (typeof this.onUpdate === 'function') {
        this.onUpdate({ action: 'MFA_POLICY_UPDATED', policy: this.mfaPolicy });
      }

      alert('MFA enforcement policy updated successfully!');
    });
  }

  static destroy() {
    this.container = null;
    this.core = null;
    this.onUpdate = null;
  }
                           }
