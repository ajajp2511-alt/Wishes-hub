/**
 * Receiver Module with Magic Proxy - Global Language & Localization
 * Path: admin/features/global-language/connection/global-language-receiver.js
 */

import { eventBus } from '../../eventbus.js';
import * as GlobalLanguageAssemblyModule from '../global-language-assembly.js';

/**
 * 🪄 MAGIC PROXY DISPATCHER
 * Yeh proxy ek "smart guard" ki tarah kaam karta hai. 
 * Jab bhi koi event aata hai, yeh bina kisi manual list ke direct GlobalLanguageAssembly 
 * (ya exports) me function dhoond kar run kar deta hai.
 */
const proxyHandler = {
  get(target, actionName) {
    // Agar export me wo function/property pehle se mojood hai
    if (target[actionName]) {
      return target[actionName];
    }
    
    // Fallback agar action nahi milta
    return (payload) => {
      console.warn(`⚠️ [Magic Proxy] Warning: Action '${actionName}' global-language module me nahi mila.`);
    };
  }
};

// Exports ke upar Magic Proxy laga diya
const smartDispatcher = new Proxy(GlobalLanguageAssemblyModule, proxyHandler);

/**
 * Global Broadcast Listener: 
 * Event aate hi Proxy khud-b-khud intercept karega aur function run kar dega.
 */
eventBus.on('GLOBAL_BROADCAST', (eventData) => {
  const { sourceModule, actionName, payload } = eventData;
  
  console.log(`🪄 [Global Language Receiver] Intercepted action: ${actionName}`);
  
  // 🪄 Magic Proxy ke zariye action call karna (Zero manual wiring)
  if (typeof smartDispatcher[actionName] === 'function') {
    smartDispatcher[actionName](payload);
  }
});

console.log("🪄 [Global Language Receiver] Initialized with Magic Proxy auto-routing.");
