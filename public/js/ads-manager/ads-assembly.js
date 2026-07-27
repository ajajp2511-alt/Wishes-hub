import { AdsCore } from './ads-core.js';

export class AdsAssembly {
  constructor() {
    this.core = new AdsCore();
  }

  init() {
    console.log('📢 Ads Manager Module Loaded Successfully!');
  }
}

// 🔽 Yeh function file ke end me add kar dijiye
export function initAdsManager() {
  const assembly = new AdsAssembly();
  assembly.init();
  return assembly;
}
