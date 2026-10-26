// admin/features/eventBus.js
// Universal Central Event Bus for Cross-Module Communication

class EventBus {
  constructor() {
    this.bus = new EventTarget();
  }

  /**
   * Event emit (publish) karne ke liye
   * @param {string} eventName - Event ka naam (e.g., 'wallet:updated')
   * @param {Object} detail - Event ke sath bheja jane wala data
   */
  emit(eventName, detail = {}) {
    const customEvent = new CustomEvent(eventName, { detail });
    this.bus.dispatchEvent(customEvent);
    console.log(`📡 [EventBus] Emitted: ${eventName}`, detail);
  }

  /**
   * Event ko listen (subscribe) karne ke liye
   * @param {string} eventName - Event ka naam
   * @param {Function} callback - Data receive hone par run hone wala function
   */
  on(eventName, callback) {
    const handler = (e) => callback(e.detail);
    this.bus.addEventListener(eventName, handler);
    return handler;
  }

  /**
   * Listener ko remove karne ke liye
   * @param {string} eventName - Event ka naam
   * @param {Function} handler - Handler function reference
   */
  off(eventName, handler) {
    this.bus.removeEventListener(eventName, handler);
  }
}

export const eventBus = new EventBus();
export default eventBus;
