/**
 * Receiver Module with Magic Proxy - Outlet Dynamic View Manager
 * Path: admin/features/outlet/connection/outlet-receiver.js
 */

import { eventBus } from '../../eventbus.js';
import * as OutletAssemblyModule from '../outlet-assembly.js';

/**
 * 🪄 MAGIC PROXY DISPATCHER
 * Yeh proxy ek "smart guard" ki tarah kaam karta hai. 
 * Jab bhi koi event aata hai, yeh bina kisi manual list ke direct OutletAssembly 
 * ya uske exports me function dhoond kar run kar detector hai.
 */
const proxyHandler = {
  get(target, actionName) {
    // Agar assembly ya export me wo function/property pehle se mojood hai
    if (target[actionName]) {
      return target[actionName];
    }
    
    // Fallback agar action nahi milta
    return (payload) => {
      console.warn(`⚠️ [Magic Proxy] Warning: Action '${actionName}' outlet module me nahi mila.`);
    };
  }
};

// OutletAssembly ke upar Magic Proxy laga diya
const smartDispatcher = new Proxy(OutletAssemblyModule, proxyHandler);

/**
 * Global Broadcast Listener: 
 * Event aate hi Proxy khud-b-khud intercept karega aur function run kar dega.
 */
eventBus.on('GLOBAL_BROADCAST', (eventData) => {
  const { sourceModule, actionName, payload } = eventData;
  
  console.log(`🪄 [Outlet Receiver] Intercepted action: ${actionName}`);
  
  // 🪄 Magic Proxy ke zariye action call karna (Zero manual wiring)
  if (typeof smartDispatcher[actionName] === 'function') {
    smartDispatcher[actionName](payload);
  }
});

console.log("🪄 [Outlet Receiver] Initialized with Magic Proxy auto-routing.");
