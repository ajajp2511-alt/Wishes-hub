/**
 * Create Wish Feature - Interactive Elements Sub-Module
 * Path: admin/features/create-wish/modules/interactive-wish-module.js
 */

import { createWishInteractiveInstance } from '../create-wish-interactive.js';

export class InteractiveWishModule {
  render(container) {
    container.innerHTML = `
      <div class="form-group">
        <label>Interactive Widget Type</label>
        <select id="interactive-widget-type">
          <option value="scratch_card">Scratch Card</option>
          <option value="confidential_envelope">Envelope</option>
          <option value="pop_up_confetti">Confetti</option>
        </select>
      </div>
      <div class="form-group">
        <label>Security PIN (Optional)</label>
        <input type="password" id="input-pin-code" maxlength="6" placeholder="Set 4-6 digit PIN" />
      </div>
    `;
  }

  bindEvents(onUpdate) {
    document.getElementById('interactive-widget-type')?.addEventListener('change', (e) => {
      const config = createWishInteractiveInstance.buildWidgetConfig(e.target.value);
      onUpdate({ WidgetConfig: config });
    });

    document.getElementById('input-pin-code')?.addEventListener('input', (e) => {
      const res = createWishInteractiveInstance.setupPinLock(e.target.value);
      if (res.success) {
        onUpdate({ Passcode: res.passcode, IsProtected: true });
      }
    });
  }
}
