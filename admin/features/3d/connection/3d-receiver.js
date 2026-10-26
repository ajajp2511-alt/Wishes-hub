/**
 * Receiver Module with Magic Proxy - 3D Engine
 * Path: wishes-hub/admin/features/3d/connection/3d-receiver.js
 */

import { coreEngine } from '../3d-core.js';
import * as Master3DAssemblyModule from '../3d-assembly.js';

/**
 * 🪄 MAGIC PROXY DISPATCHER
 * Yeh proxy ek "smart guard" ki tarah kaam karta hai. 
 * Jab bhi koi event aata hai, yeh bina kisi manual list ke direct Master3DAssembly 
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
      console.warn(`⚠️ [Magic Proxy] Warning: Action '${actionName}' 3d module me nahi mila.`);
    };
  }
};

// Master3DAssembly ke upar Magic Proxy laga diya
const smartDispatcher = new Proxy(Master3DAssemblyModule, proxyHandler);

/**
 * Global Broadcast Listener: 
 * Event aate hi Proxy khud-b-khud intercept karega aur function run kar dega.
 */
coreEngine.on('GLOBAL_BROADCAST', (eventData) => {
  const { sourceModule, actionName, payload } = eventData;
  
  console.log(`🪄 [3D Receiver] Intercepted action: ${actionName}`);
  
  // 🪄 Magic Proxy ke zariye action call karna (Zero manual wiring)
  if (typeof smartDispatcher[actionName] === 'function') {
    smartDispatcher[actionName](payload);
  }
});

console.log("🪄 [3D Receiver] Initialized with Magic Proxy auto-routing.");
