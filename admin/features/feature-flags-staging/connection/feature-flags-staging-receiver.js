/**
 * Receiver Module with Magic Proxy - Feature Flags & Staging
 * Path: admin/features/feature-flags-staging/connection/feature-flags-staging-receiver.js
 */

import { eventBus } from '../../eventbus.js';
import * as FeatureFlagsAssemblyModule from '../feature-flags-assembly.js';

/**
 * 🪄 MAGIC PROXY DISPATCHER
 * Yeh proxy ek "smart guard" ki tarah kaam karta hai. 
 * Jab bhi koi event aata hai, yeh bina kisi manual list ke direct FeatureFlagsAssembly 
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
      console.warn(`⚠️ [Magic Proxy] Warning: Action '${actionName}' feature-flags-staging module me nahi mila.`);
    };
  }
};

// FeatureFlagsAssembly ke upar Magic Proxy laga diya
const smartDispatcher = new Proxy(FeatureFlagsAssemblyModule, proxyHandler);

/**
 * Global Broadcast Listener: 
 * Event aate hi Proxy khud-b-khud intercept karega aur function run kar dega.
 */
eventBus.on('GLOBAL_BROADCAST', (eventData) => {
  const { sourceModule, actionName, payload } = eventData;
  
  console.log(`🪄 [Feature Flags & Staging Receiver] Intercepted action: ${actionName}`);
  
  // 🪄 Magic Proxy ke zariye action call karna (Zero manual wiring)
  if (typeof smartDispatcher[actionName] === 'function') {
    smartDispatcher[actionName](payload);
  }
});

console.log("🪄 [Feature Flags & Staging Receiver] Initialized with Magic Proxy auto-routing.");
