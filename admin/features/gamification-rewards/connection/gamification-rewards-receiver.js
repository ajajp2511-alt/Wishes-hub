/**
 * Receiver Module with Magic Proxy - Gamification & Rewards
 * Path: admin/features/gamification-rewards/connection/gamification-rewards-receiver.js
 */

import { eventBus } from '../../eventbus.js';
import * as GamificationAssemblyModule from '../gamification-assembly.js';

/**
 * 🪄 MAGIC PROXY DISPATCHER
 * Yeh proxy ek "smart guard" ki tarah kaam karta hai. 
 * Jab bhi koi event aata hai, yeh bina kisi manual list ke direct GamificationAssembly 
 * ya uske exports me function dhoond kar run kar deta hai.
 */
const proxyHandler = {
  get(target, actionName) {
    // Agar assembly ya export me wo function/property pehle se mojood hai
    if (target[actionName]) {
      return target[actionName];
    }
    
    // Fallback agar action nahi milta
    return (payload) => {
      console.warn(`⚠️ [Magic Proxy] Warning: Action '${actionName}' gamification-rewards module me nahi mila.`);
    };
  }
};

// GamificationAssembly ke upar Magic Proxy laga diya
const smartDispatcher = new Proxy(GamificationAssemblyModule, proxyHandler);

/**
 * Global Broadcast Listener: 
 * Event aate hi Proxy khud-b-khud intercept karega aur function run kar dega.
 */
eventBus.on('GLOBAL_BROADCAST', (eventData) => {
  const { sourceModule, actionName, payload } = eventData;
  
  console.log(`🪄 [Gamification & Rewards Receiver] Intercepted action: ${actionName}`);
  
  // 🪄 Magic Proxy ke zariye action call karna (Zero manual wiring)
  if (typeof smartDispatcher[actionName] === 'function') {
    smartDispatcher[actionName](payload);
  }
});

console.log("🪄 [Gamification & Rewards Receiver] Initialized with Magic Proxy auto-routing.");
