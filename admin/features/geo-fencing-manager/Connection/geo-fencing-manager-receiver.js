/**
 * Receiver Module with Magic Proxy - Geo-Fencing & Cyber Fortress
 * Path: admin/features/geo-fencing-manager/connection/geo-fencing-manager-receiver.js
 */

import { eventBus } from '../../eventbus.js';
import * as GeoAssemblyModule from '../geo-assembly.js';

/**
 * 🪄 MAGIC PROXY DISPATCHER
 * Yeh proxy ek "smart guard" ki tarah kaam karta hai. 
 * Jab bhi koi event aata hai, yeh bina kisi manual list ke direct GeoAssembly 
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
      console.warn(`⚠️ [Magic Proxy] Warning: Action '${actionName}' geo-fencing-manager module me nahi mila.`);
    };
  }
};

// GeoAssembly ke upar Magic Proxy laga diya
const smartDispatcher = new Proxy(GeoAssemblyModule, proxyHandler);

/**
 * Global Broadcast Listener: 
 * Event aate hi Proxy khud-b-khud intercept karega aur function run kar dega.
 */
eventBus.on('GLOBAL_BROADCAST', (eventData) => {
  const { sourceModule, actionName, payload } = eventData;
  
  console.log(`🪄 [Geo-Fencing Manager Receiver] Intercepted action: ${actionName}`);
  
  // 🪄 Magic Proxy ke zariye action call karna (Zero manual wiring)
  if (typeof smartDispatcher[actionName] === 'function') {
    smartDispatcher[actionName](payload);
  }
});

console.log("🪄 [Geo-Fencing Manager Receiver] Initialized with Magic Proxy auto-routing.");
