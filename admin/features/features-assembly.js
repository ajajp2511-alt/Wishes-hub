console.log("📌 Admin Features Assembly Orchestrator Booting...");

export class FeaturesAssembly {
  constructor() {
    console.log("🚀 Booting Wishes Hub Admin System with Bulletproof Shielding...");
    this.bootSystem();
  }

  /**
   * 🛡️ SAFE ISOLATION LAUNCHER
   * Dynamic import() use karke har module ko isolated sandbox me load karta hai.
   */
  async safeRun(name, importPath, initFns) {
    try {
      // 1. Dynamic Import: File 404 ya corrupt hone par bhi main thread rukega nahi
      const module = await import(importPath);

      if (!module) return null;

      // 2. Class Instance ya Direct Export Check
      if (Array.isArray(initFns)) {
        for (const fnName of initFns) {
          if (typeof module[fnName] === 'function') {
            await module[fnName]();
          } else if (module.default && typeof module.default[fnName] === 'function') {
            await module.default[fnName]();
          }
        }
      } 
      // Single Function / Class Static Method
      else if (typeof module[initFns] === 'function') {
        await module[initFns]();
      } else if (module.default && typeof module.default[initFns] === 'function') {
        await module.default[initFns]();
      }

      console.log(`✅ Admin Module Loaded Successfully: [${name}]`);
      return module;
    } catch (err) {
      // 💥 SHIELD ACTIVE: Error ko warn level par isolate kiya gaya hai
      console.warn(`🛡️ [Shield Intercepted Error in Admin Module: ${name}]: Dashboard is safe. Details:`, err.message);
      return null;
    }
  }

  async bootSystem() {
    // Phase 1: Core Layout & Navigation Outlet (Sequential Load)
    await this.safeRun('outlet', './outlet/outlet-assembly.js', 'initOutlet');

    // Phase 2: Independent Admin Modules (Parallel Fault-Tolerant Execution)
    await Promise.allSettled([
      this.safeRun('analytics', './analytics/analytics-assembly.js', 'initAnalytics'),
      this.safeRun('settings', './settings/settings-assembly.js', 'initSettings'),
      this.safeRun('media', './media/media-assembly.js', 'initMedia'),
      this.safeRun('wishes', './wishes/wishes-assembly.js', 'initWishes'),
      this.safeRun('auth', './auth/auth-assembly.js', 'initAuth')
    ]);

    console.log("🎉 All Admin Assemblies Initialized with Fault Tolerance!");
  }
}

// Auto Bootstrapping
if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', () => new FeaturesAssembly());
} else {
  new FeaturesAssembly();
}
