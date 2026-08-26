/**
 * Create Wish Feature - Interactive Elements & PIN Lock
 * Path: admin/features/create-wish/create-wish-interactive.js
 */

export class CreateWishInteractive {
  constructor() {
    this.widgetTypes = {
      SCRATCH_CARD: 'scratch_card',
      COUNTDOWN_TIMER: 'countdown_timer',
      ENVELOPE: 'confidential_envelope',
      CONFETTI: 'pop_up_confetti'
    };
  }

  buildWidgetConfig(type, options = {}) {
    switch (type) {
      case this.widgetTypes.SCRATCH_CARD:
        return {
          type: this.widgetTypes.SCRATCH_CARD,
          coverColor: options.coverColor || '#cccccc',
          scratchPercentRequired: options.scratchPercent || 50
        };

      case this.widgetTypes.COUNTDOWN_TIMER:
        return {
          type: this.widgetTypes.COUNTDOWN_TIMER,
          targetDate: options.targetDate || new Date().toISOString(),
          completionMessage: options.completionMessage || 'The wish is unlocked!'
        };

      case this.widgetTypes.ENVELOPE:
        return {
          type: this.widgetTypes.ENVELOPE,
          sealIcon: options.sealIcon || '✉️',
          stampText: options.stampText || 'CONFIDENTIAL'
        };

      case this.widgetTypes.CONFETTI:
        return {
          type: this.widgetTypes.CONFETTI,
          particleCount: options.particleCount || 100,
          spread: options.spread || 70
        };

      default:
        return null;
    }
  }

  setupPinLock(pin) {
    if (!pin || pin.toString().length < 4) {
      return { success: false, message: 'PIN must be at least 4 digits.' };
    }
    return {
      success: true,
      passcode: pin.toString(),
      isProtected: true
    };
  }
}

export const createWishInteractiveInstance = new CreateWishInteractive();
